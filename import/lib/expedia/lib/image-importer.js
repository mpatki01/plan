(function () {
    'use strict';

    var importer = require('../../textfile-importer');

    function parse(options, callback) {
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
    }

    module.exports.import = function (options, callback) {
        options.parse = parse;
        options.completed = callback;
        var imgImporter = importer.create(options);
        imgImporter.import(callback);
    };

}());

