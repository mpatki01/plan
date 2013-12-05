var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server;
var fs = require('fs');
var lineReader = require('line-reader');
var databaseName = 'triptacular';
var mongoClient = new MongoClient(new Server('localhost', 27017));
var filename = '/home/mike/geonames_data/featureCodes_en.txt';
var inStream = fs.createReadStream(filename, {flags:'r'});
var threshold = 30000;
var records = [];

mongoClient.open(function(err, mongoClient) {
    var db = mongoClient.db('triptacular');
    var collection = db.collection('features');
    var index = 0;
    var records = [];
    var lineCount = 0;
    lineReader.eachLine(filename, function(line, isLastLine) {
        if (line[0] != '#') {
            var fields = line.split('\t');
            var record = {
                class: fields[0].split('.')[0],
                code: fields[0].split('.')[1],
                name: fields[1],
                description: fields[2]
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
