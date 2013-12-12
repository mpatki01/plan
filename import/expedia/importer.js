var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    lineReader = require('line-reader');

var DataImporter = function (options) {
    'use strict';
    var self = this;
    options = options || {};
    self.host = options.host || 'localhost';
    self.port = options.port || 27017;
    self.database = options.database;
    self.collection = options.collection;
    self.filename = options.filename;
    self.threshold = options.threshold || 100;
    self.callback = null;
    self.processed = 0;
    self.inserted = 0;
    self.linesInFile = 0;
    self.records = [];
    self.isLastLine = false;

    self.parse = function (line) {
        var record = null,
            fields = line.split('|');
        if (line) {
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
        var record = self.parse(line),
            recordable = self.records.length === self.threshold || self.isLastLine;
        self.records.push(record);
        if (recordable) {
            collection.insert(self.records, { w: 1, fsync: true }, function (err, result) {
                if (err) {
                    self.callback(err);
                }

                self.inserted = self.inserted + result.length;
                console.log(self.inserted + ' records inserted.');
                if (self.processed === self.linesInFile &&
                    self.inserted === self.linesInFile) {
                    self.callback(null);
                }
            });
            self.records = [];
        }
        self.processed = self.processed + 1;
    };

    self.import = function (callback) {
        if (!callback) {
            console.log('The import function requires a callback.');
            return;
        }

        var mongoServer = new Server(self.host, self.port),
            mongoClient = new MongoClient(mongoServer);
        self.callback = callback;
        mongoClient.open(function (err, mongoClient) {
            if (err) {
                self.callback(err);
            }

            var db = mongoClient.db(self.database),
                collection = db.collection(self.collection),
                lines = 0;

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

module.exports = DataImporter;
