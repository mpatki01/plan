var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server;
var fs = require('fs');
var lineReader = require('line-reader');
var databaseName = 'triptacular';
var mongoClient = new MongoClient(new Server('localhost', 27017));
var filename = '/home/mike/geonames_data/admin2Codes.txt';
var inStream = fs.createReadStream(filename, {flags:'r'});
var threshold = 30000;
var records = [];

mongoClient.open(function(err, mongoClient) {
    var db = mongoClient.db('triptacular');
    var collection = db.collection('administrations');
    var index = 0;
    var records = [];
    var lineCount = 0;
    lineReader.eachLine(filename, function(line, isLastLine) {
        if (line[0] != '#') {
            var fields = line.split('\t');
            var record = {
                geonameId: parseInt(fields[3]),
                type: 'Admin2',
                countryIso: fields[0].split('.')[0],
                admin1Code: fields[0].split('.')[1],
                adminCode: fields[0].split('.')[2],
                name: fields[2],
                loweredName: fields[2].toLowerCase()
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
