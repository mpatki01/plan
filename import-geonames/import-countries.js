var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server;
var fs = require('fs');
var lineReader = require('line-reader');
var databaseName = 'triptacular';
var mongoClient = new MongoClient(new Server('localhost', 27017));
var filename = '/home/mike/geonames_data/countryInfo.txt';
var inStream = fs.createReadStream(filename, {flags:'r'});
var threshold = 30000;
var continentCodes = {
    AF: "Africa",
    AS: "Asia",
    EU: "Europe",
    NA: "North America",
    OC: "Oceania",
    SA: "South America",
    AN: "Antarctica"
};
var records = [];

mongoClient.open(function(err, mongoClient) {
    var db = mongoClient.db('triptacular');
    var collection = db.collection('countries');
    var index = 0;
    var records = [];
    var lineCount = 0;
    lineReader.eachLine(filename, function(line, isLastLine) {
        if (line[0] != '#') {
            var fields = line.split('\t');
            var record = {
                geonameId: parseInt(fields[16]),
                name: fields[4],
                loweredName: fields[4].toLowerCase(),
                codes: {
                    iso: fields[0],
                    iso3: fields[1],
                    isoNumeric: parseInt(fields[2]),
                    fips: fields[3],
                },
                capital: fields[5],
                area: parseInt(fields[6]),
                population: parseInt(fields[7]),
                continent: {
                    code: fields[8],
                    name: continentCodes[fields[8]],
                    loweredName: continentCodes[fields[8]].toLowerCase()
                }
            };
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
        }
    });
});
