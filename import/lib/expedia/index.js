(function () {
    'use strict';

    var charm = require('charm')(),
        imageImporter = require('./lib/image-importer.js');
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
        charm.erase('line');
        charm.cursor(true);
        console.log('Done importing ' + type);
    }

    var imageOptions = {
        collection: 'images',
        filename: './data/HotelImageList.sample',
        threshold: 10000,
        inserted: function (total) {
            inserted('Image', total);
        }
    };
    imageImporter.import(imageOptions, function (err) { 
        if (err) {
    		console.log(err);
    		return;
    	}
    	imported('images'); 
        process.exit(0);
	});
}());
