/*jslint nomen: true */

var charm = require('charm')(),
    imageImporter = require('./lib/image-importer.js');

var expediaImporter = function () {
    'use strict';

    function inserted(type, total) {
        var msg = type + ' records inserted: ' + total;
        charm.erase('line');
        charm.write(msg);
        charm.left(msg.length);
    }

    function imported(type) {
        charm.down(1);
        charm.erase('line');
        charm.cursor(true);
        console.log('Done importing ' + type);
    }

    var _that = {},
        _imgImporter = imageImporter.create({
            collection: 'images',
            filename: './data/HotelImageList.txt',
            threshold: 10000,
            inserted: function (total) {
                inserted('Image', total);
            },
            completed: function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                imported('images');
                process.exit(0);
            }
        });

    _that.main = function () {
        charm.pipe(process.stdout);
        charm.cursor(false);
        _imgImporter.import();
    };

    return _that;
};

expediaImporter().main();