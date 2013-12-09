var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server;
var fs = require('fs');
var lineReader = require('line-reader');
var databaseName = 'triptacular';
var mongoClient = new MongoClient(new Server('localhost', 27017));
var filename = './data/HotelImageList.txt';
var inStream = fs.createReadStream(filename, {flags:'r'});
var threshold = 30000;
var records = [];

mongoClient.open(function(err, mongoClient) {
    var db = mongoClient.db('triptacular');
    var collection = db.collection('images');
    var index = 0;
    var records = [];
    var lineCount = 0;
    lineReader.eachLine(filename, function(line, isLastLine) {
        if (lineCount > 0) {
            var fields = line.split('|');
            var record = {
                expediaHotelId: parseInt(fields[0]),
                caption: fields[1],
                url: fields[2],
                width: parseInt(fields[3]),
                height: parseInt(fields[4]),
                thumbnailUrl: fields[6],
                isDefault: fields[7] == '1' ? true : false
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
        }
        lineCount++;
    });
});
