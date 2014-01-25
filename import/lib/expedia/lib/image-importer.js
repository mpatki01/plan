/*jslint nomen: true */

var importer = require('../../textfile-importer');

var imageImporter = function (options) {
    'use strict';

    /**
     * Parses a row of text into a MongoDB Expedia image record.
     * @param {Object} options A set of options used for parsing.
     * @param {Function} callback Executed when each row is parsed.
     */
    options.parse = function (options, callback) {
        var record = null,
            fields = [];
        if (options.line) {
            fields = options.line.split('|');
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
    };

    var _that = importer.create(options);

    _that.import = function () {
        _that.start();
    };

    return _that;
};


module.exports.create = imageImporter;