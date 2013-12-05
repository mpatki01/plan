var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server;
var fs = require('fs');
var lineReader = require('line-reader');
var databaseName = 'triptacular';
var mongoClient = new MongoClient(new Server('localhost', 27017));
var filename = '/home/mike/data/GB.txt';
var inStream = fs.createReadStream(filename, {flags:'r'});
var threshold = 10000;
var records = [];

mongoClient.open(function(err, mongoClient) {
    var db = mongoClient.db('triptacular');
    var collection = db.collection('countries');
    var countries = {};
    var stream = collection.find().stream();
    stream.on('data', function(item) {
        countries[item.codes.iso] = item;
    });
    stream.on('end', function() {
        var administrations = {};
        collection = db.collection('administrations');
        var stream2 = collection.find().stream();
        stream2.on('data', function(item) {
            var key = "";
            if (item.type == "Admin1") {
                key = item.countryIso + '.' + item.adminCode;
            }
            if (item.type == "Admin2") {
                key = item.countryIso + '.' + item.admin1Code + '.' + item.adminCode;
            }
            administrations[key] = item;
        });
        stream2.on('end', function() {

            var features = {};
            collection = db.collection('features');
            var stream3 = collection.find().stream();
            stream3.on('data', function(item) {
                var key = item.class + '.' + item.code;
                features[key] = item;
            });
            stream3.on('end', function() {

                collection = db.collection('places');
                var index = 0;
                var records = [];
                var lineCount = 0;
                lineReader.eachLine(filename, function(line, isLastLine) {
                    var fields = line.split('\t');
                    var record = {
                        geonameId : parseInt(fields[0]),
                        name : fields[1],
                        asciiName : fields[2],
                        alternateNames : fields[3] ? fields[3].split(',') : [],
                        loc : [parseFloat(fields[5]),parseFloat(fields[4])],
                        country : {
                            _id: fields[8] ? countries[fields[8]]._id : "",
                            geonameId: fields[8] ? countries[fields[8]].geonameId : "",
                            iso: fields[8] ? countries[fields[8]].codes.iso : "",
                            iso3: fields[8] ? countries[fields[8]].codes.iso3 : "",
                            name: fields[8] ? countries[fields[8]].name : ""
                        },
                    population : fields[14] ? parseInt(fields[14]) : -1,
                        elevation : fields[15],
                        dem : fields[16],
                        timezone : fields[17],
                        modificationDate : new Date(fields[18])
                    };
                    if (fields[9]) {
                        record.alternateCountryCodes = fields[9].split(',');
                    }

                    if (fields[6] && fields[7]) {
                        var key = fields[6] + '.' + fields[7];
                        var feature = features[key];
                        record.feature = {
                            class: fields[6],
                            code: fields[7],
                            name: feature.name
                        }
                    }

                    var countryCode = fields[8] ? countries[fields[8]].codes.iso : "";
                    var regionalCode = fields[10];
                    var hasRegionalAdmin = false;
                    if (countryCode && fields[10]) {
                        var administration = administrations[countryCode + '.' + fields[10]];
                        if (administration) {
                            hasRegionalAdmin = true;
                            record.administrations = {}
                            record.administrations.regional = {
                                _id: administration._id,
                                geonameId: administration.geonameId,
                                code: fields[10],
                                name: administration.name
                            }
                        }
                    }

                    var hasMunicipalAdmin = false;
                    if (countryCode && regionalCode && fields[11]) {
                        var key = countryCode + '.' + 
                                regionalCode + '.' + 
                                fields[11];
                        var administration = administrations[key];
                        if (administration) {
                            hasMunicipalAdmin = true;
                            record.administrations = record.administrations || {};
                            record.administrations.municipal = {
                                _id: administration._id,
                                geonameId: administration.geonameId,
                                code: fields[11],
                                name: administration.name
                            }
                        }
                    }
                    record.tags = [
                        record.name.toLowerCase()
                    ];
                    if (record.country.name) {
                        record.tags.push(record.country.name.toLowerCase());
                    }
                    if (record.country.iso) {
                        record.tags.push(record.country.iso.toLowerCase());
                    }
                    if (record.country.iso3) {
                        record.tags.push(record.country.iso3.toLowerCase());
                    }
                    if (record.feature) {
                        record.tags.push(record.feature.name);
                    }
                    if (hasRegionalAdmin) {
                        var name = record.administrations.regional.name.toLowerCase();
                        record.tags.push(name);
                    }
                    if (hasMunicipalAdmin) {
                        var name = record.administrations.municipal.name.toLowerCase();
                        record.tags.push(name);
                    }
                    records.push(record);
                    if (records.length == threshold || isLastLine) {
                        collection.insert(records, {w:1}, function(err, result) {
                            if (err) {
                                console.log('insert failure');
                            }
                            if (isLastLine) {
                                index = lineCount;
                            }
                            else {
                                index += threshold;
                            }
                            console.log(index + ' records inserted');
                            if (isLastLine) {
                                process.exit(1);
                            }
                        });
                        records = [];
                    }
                    lineCount++;
                });
            });
        });
    });
});
