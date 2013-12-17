/*jslint nomen: true */

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    lineReader = require('line-reader');

/**
 * Imports data into MongoDb from a text file.
 * @constructor
 * @param {Object} options Optional values for the importer.
 * @param {String} options.host The hostname of the MongoDB server.
 * @param {Number} options.port The port used by the MongoDB server.
 * @param {String} options.database The database in which the data will be
 *                                  stored.
 * @param {String} options.collection The collection in which the data will be
 *                                   stored.
 * @param {String} options.filename The name of the text file to parse.
 * @param {Number} options.threshold The number of documents to insert as a
 *                                  batch.
 * @param {Function} options.parse A function which accepts a line of text and
 *                                 returns a document to be inserted.
 */
var TextFileImporter = function (options) {
    'use strict';
    var self = this,
        _db,
        _collection;
    options = options || {};
    self.host = options.host || 'localhost';
    self.port = options.port || 27017;
    self.database = options.database;
    self.collection = options.collection;
    self.filename = options.filename;
    self.threshold = options.threshold || 100;
    self.parse = options.parse || null;
    self.callback = null;
    self.processed = 0;
    self.inserted = 0;
    self.linesInFile = 0;
    self.records = [];
    self.isLastLine = false;

    self.onInserted = function (err, result) {
        if (err) {
            self.callback(err);
        }

        var finished = false;
        self.inserted = self.inserted + result.length;
        console.log(self.inserted + ' records inserted.');
        finished = (self.processed === self.linesInFile && 
                self.inserted === self.linesInFile);
        if (finished) {
            self.callback(null);
        }
    };

    self.processRecord = function (err, record) {
        if (err) {
            self.callback(err);
        }

        self.records.push(record);
        if (self.records.length === self.threshold || self.isLastLine) {
            _collection.insert(self.records, {w: 1}, self.onInserted);
            self.records = [];
        }
        self.processed = self.processed + 1;
    };

    /**
     * Imports the file specified in the constructor options into the database
     * and collection specified in the constructor options.
     */
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

            var lines = 0;
            _db = mongoClient.db(self.database);
            _collection = _db.collection(self.collection);

            lineReader.eachLine(self.filename, function (line, isLastLine) {
                lines = lines + 1;
                if (isLastLine) {
                    self.isLastLine = isLastLine;
                    self.linesInFile = lines;
                }
                self.parse(line, _db, _collection, self.processRecord);
            });
        });
    };
};

module.exports.import = function (options, callback) {
    'use strict';
    var importer = new TextFileImporter(options);
    importer.import(callback);
};
