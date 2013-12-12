var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var lineReader = require('line-reader');
var Importer = require('./importer.js');


var importer = new Importer({
    database: 'triptacular',
    collection: 'images',
    filename: './data/HotelImageList.sample',
    threshold: 10000
});
importer.import(function (err) {
    'use strict';
    if (err) {
        console.log(err);
    }
    console.log('done');
    process.exit(0);
});
