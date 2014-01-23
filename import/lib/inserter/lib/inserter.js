/*jslint nomen: true */

var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    config = require('../../config');

function inserter(options) {
    'use strict';

    var _that = {},
        _options = options || {},
        _mongoClient = null,
        _mongoDb = null,
        _mongoCollection = null,
        _mongoClientOpened,
        _records = [],
        _inserted = 0,
        _isLastRecord = false;

    _that.host = _options.host || config.host;
    _that.port = _options.port || config.port;
    _that.database = _options.database || config.database;
    _that.collection = _options.collection;
    _that.threshold = _options.threshold || 100;

    _that.inserted = _options.inserted || function (total) {
        console.log(total + ' records inserted.');
    };

    _that.completed = _options.completed || function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('insert operations complete.');
    };

    function mongoClientOpened(err, client) {
        if (err) {
            _that.completed(err);
            return;
        }

        _mongoClient = client;
        _mongoDb = client.db(_that.database);
        _mongoCollection = _mongoDb.collection(_that.collection);
        _mongoClientOpened(_mongoClient);
    }

    function inserted(err, result) {
        if (err) {
            _that.completed(err);
            return;
        }

        _inserted += result.length;
        _that.inserted(_inserted);
        if (_isLastRecord) {
            _that.completed(null);
        }
    }

    _that.insert = function (record, isLast) {
        _records.push(record);
        _isLastRecord = isLast;
        if (_records.length === _that.threshold || isLast) {
            _mongoCollection.insert(_records, {w: 1}, inserted);
            _records = [];
        }
    };

    _that.open = function (callback) {
        var mongoServer = new Server(_that.host, _that.port),
            mongoClient = new MongoClient(mongoServer);
        _mongoClientOpened = callback;
        mongoClient.open(mongoClientOpened);
    };

    return _that;
}

module.exports.create = inserter;
