/*jslint nomen: true */

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    lineReader = require('line-reader'),
    config = require('../../config'),
    seeder = require('../../seeder');

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
var textFileImporter = function (options) {
    'use strict';
    var _that = seeder.create(),
        _options = options || {},
        _mongoClient,
        _mongoDb = null,
        _mongoCollection = null,
        _lines = 0,
        _records = [],
        _inserted = 0,
        _linesInFile = 0,
        _recordsCount = 0,
        _isLastRecord = false;

    _that.host = _options.host || config.host;
    _that.port = _options.port || config.port;
    _that.database = _options.database || config.database;
    _that.collection = _options.collection;
    _that.filename = _options.filename;
    _that.threshold = _options.threshold || 100;
    _that.parse = _options.parse;

    _that.insertHandler = _options.inserted || function (total) {
        console.log(total + ' records inserted.');
    };

    _that.completedHandler = _options.completed || function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('done');
    };

    function onInserted(err, result) {
        if (err) {
            _that.completedHandler(err);
        }

        _inserted += result.length;
        _that.insertHandler(_inserted);
        if (_inserted === _linesInFile) {
            _that.completedHandler(null);
        }
    }

    function processRecord(err, record) {
        if (err) {
            _that.completedHandler(err);
        }

        _records.push(record);
        _recordsCount += 1;
        _isLastRecord = _recordsCount === _linesInFile;
        if (_records.length === _that.threshold || _isLastRecord) {
            _mongoCollection.insert(_records, {w: 1}, onInserted);
            _records = [];
        }
    }

    function processLine(line, isLastLine) {
        _lines = _lines + 1;
        if (isLastLine) {
            _linesInFile = _lines;
        }
        var parseOptions = {
            line: line,
            lines: _lines,
            client: _mongoClient
        };
        _that.parse(parseOptions, processRecord);
    }

    function mongoClientOpened(err, client) {
        if (err) {
            _that.completedHandler(err);
        }

        _mongoClient = client;
        _mongoDb = client.db(_that.database);
        _mongoCollection = _mongoDb.collection(_that.collection);
        lineReader.eachLine(_that.filename, processLine);
    }

    /**
     * Imports the file specified in the constructor options into the database
     * and collection specified in the constructor options.
     */
    _that.import = function (callback) {
        var mongoServer = new Server(_that.host, _that.port),
            mongoClient = new MongoClient(mongoServer);
        _that.completedHandler = callback;
        mongoClient.open(mongoClientOpened);
    };

    return _that;
};

module.exports.create = textFileImporter;
