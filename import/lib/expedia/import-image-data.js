var importer = require('./textfile-importer.js');

var options = {
    database: 'triptacular',
    collection: 'images',
    filename: './data/HotelImageList.txt',
    threshold: 10000,
    parse: function (line, count, client, callback) {
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
};

importer.import(options, function (err) {
    'use strict';
    if (err) {
        'error: ' + console.log(err);
    }
    console.log('done');
    process.exit(0);
});
