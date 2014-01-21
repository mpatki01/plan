(function () {
    'use strict';

    var imageIngestor = require('./import-image-data.js');

    imageIngestor.ingest(function () {
        console.log('Done');
        process.exit(0);
    });
    
}());

