(function () {
    'use strict';

    var charm = require('charm')();
    var importer = require('../../textfile-importer');
    charm.pipe(process.stdout);
    charm.cursor(false);

    function parse(line, count, client, callback) {
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
        callback(null, record);
    }

    function ingest(callback) {
        var options = {
            collection: 'images',
            filename: '../data/HotelImageList.txt',
            threshold: 10000,
            parse: parse,
            inserted: function (total) {
                var msg = 'Image records inserted: ' + total;
                charm.erase('line');
                charm.write(msg);
                charm.left(msg.length);
            }
        };

        importer.import(options, function (err) {
            if (err) {
                console.log(err);
                return;
            }

            charm.down(1);
            charm.cursor(true);
            if (callback) {
                callback();
            }
        });
    }

    module.exports.ingest = ingest;
}());

