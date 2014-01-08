var importer = require('../textfile-importer');

var Image = function(options) {
    options = options || {};
    this.url = options.url;
    this.width = options.width;
    this.height = options.height;
    this.thumbnailUrl = options.thumbnailUrl;
    this.isDefault = options.isDefault;
};

var toImages = function (array) {
    var images = [],
        index = 0,
        image = null;
    for (index = 0; index < array.length; index++) {
        image = new Image(array[index]);
        images.push(image);
    }
    return images;
};

var getImages = function (id, db, callback) {
    var images = [],
        collection = db.collection('images');
    collection.find({'expediaHotelId': id}, function(err, cursor) {
        if(err) {
            callback(err);
            return;
        }

        cursor.toArray(function(err, array) {
            if (err) {
                callback(err);
                return;
            }
            images = toImages(array);
            callback(null, images);
        });
    });
};

var parse = function (line, count, client, callback) {
    'use strict';
    var record = null,
        fields = line.split('|'),
        affiliateId = null;
    affiliateId = parseInt(fields[0]);
    record = {
        name: fields[2],
        airportCode: fields[11],
        currency: fields[13],
        starRating: fields[14] ? parseFloat(fields[14]) : null,
        highRate: parseFloat(fields[20]),
        lowRate: parseFloat(fields[21]),
        checkInTime: fields[22],
        checkOutTime: fields[23],
        address: {
            street1: fields[3],
            street2: fields[4],
            city: fields[5],
            region: fields[6],
            postalCode: fields[7],
            country: fields[8],
            location: fields[17]
        },
        location: [
            parseFloat(fields[10]),
            parseFloat(fields[9])
        ],
        affiliate: {
            name: 'expedia',
            id: affiliateId,
            sequenceNumber: parseInt(fields[1]),
            propertyCategory: parseInt(fields[12]),
            confidence: parseInt(fields[15]),
            supplierType: fields[16],
            chainCodeId: fields[18] ? parseInt(fields[18]) : null,
            regionId: parseInt(fields[19])
        }
    };

    var db = client.db("triptacular");
    getImages(affiliateId, db, function (err, images) {
        if (err) {
            callback(err);
            return;
        }

        record.images = images;
        callback(null, record);
    });
};

var options = {
    database: 'triptacular',
    collection: 'properties',
    filename: './data/ActivePropertyList.txt',
    threshold: 1000,
    parse: parse
};

importer.import(options, function (err) {
    'use strict';
    if (err) {
        console.log(err);
    }
    console.log('done');
    process.exit(0);
});
