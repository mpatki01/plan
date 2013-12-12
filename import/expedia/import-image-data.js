var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var lineReader = require('line-reader');

var DataImporter = function (callback) {
    'use strict';
    var self = this;
    self.host = 'localhost';
    self.port = 27017;
    self.database = 'triptacular';
    self.collection = 'images';
    self.filename = './data/HotelImageList.sample';
    self.threshold = 50000;
    self.processed = 0;
    self.inserted = 0;
    self.linesInFile = 0;
    self.records = [];
    self.isLastLine = false;
    self.callback = callback;

    self.parse = function (line) {
        var record = null;
        if (line) {
            var fields = line.split('|');
            record = {
                expediaHotelId: parseInt(fields[0], 10),
                caption: fields[1],
                url: fields[2],
                width: parseInt(fields[3], 10),
                height: parseInt(fields[4], 10),
                thumbnailUrl: fields[6],
                isDefault: fields[7] === '1' ? true : false
            };
        }
        return record;
    };

    self.processLine = function (line, collection) {
        var record = self.parse(line);
        self.records.push(record);
        var recordable = self.records.length === self.threshold || self.isLastLine;
        if (recordable) {
            collection.insert(self.records, { w: 1, fsync: true }, function (err, result) {
                if (err) {
                    self.callback(err);
                }

                self.inserted = self.inserted + result.length;
                console.log(self.inserted + ' records inserted.');
                if (self.processed = self.linesInFile &&
                    self.inserted === self.linesInFile) {
                    self.callback(null);
                }
            });
            self.records = [];
        }
        self.processed = self.processed + 1;
    };

    self.ingest = function () {
        var mongoServer = new Server(self.host, self.port);
        var mongoClient = new MongoClient(mongoServer);
        mongoClient.open(function (err, mongoClient) {
            if (err) {
                self.callback(err);
            }

            var db = mongoClient.db(self.database);
            var collection = db.collection(self.collection);
            var lines = 0;
            lineReader.eachLine(self.filename, function (line, isLastLine) {
                lines = lines + 1;
                if (isLastLine) {
                    self.isLastLine = isLastLine;
                    self.linesInFile = lines;
                }
                self.processLine(line, collection);
            });
        });
    };
};

var ingestor = new DataImporter(function (err) {
    if (err) {
        console.log(err);
    }
    console.log('done');
    process.exit(0);
});
ingestor.ingest();

