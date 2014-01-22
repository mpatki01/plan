(function () {
    'use strict';

    var charm = require('charm')(),
        imageImporter = require('./image-importer.js');
    charm.pipe(process.stdout);
    charm.cursor(false);

    function inserted(type, total) {
        var msg = type + ' records inserted: ' + total;
        charm.erase('line');
        charm.write(msg);
        charm.left(msg.length);
    }

    function imported(type) {
        charm.down(1);
        charm.cursor(true);
        console.log('Done importing ' + type);
    }

    imageImporter.import({
        collection: 'images',
        filename: '../data/HotelImageList.txt',
        threshold: 10000,
        inserted: function (total) {
            inserted('Image', total);
        }
    }, function () { imported('images'); });
}());
