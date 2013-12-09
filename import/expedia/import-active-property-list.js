var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server;
var fs = require('fs');
var lineReader = require('line-reader');
var databaseName = 'triptacular';
var mongoClient = new MongoClient(new Server('localhost', 27017));
var filename = './data/ActivePropertyList.txt';
var inStream = fs.createReadStream(filename, {flags:'r'});
var threshold = 500;
var records = [];

mongoClient.open(function(err, mongoClient) {
    var db = mongoClient.db('triptacular');
    var collection = db.collection('properties');
    var index = 0;
    var lineCount = 0;
    lineReader.eachLine(filename, function(line, isLastLine) {
        if (lineCount > 0) {
            var fields = line.split('|');
            var record = {
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
                    id: parseInt(fields[0]),
                    sequenceNumber: parseInt(fields[1]),
                    propertyCategory: parseInt(fields[12]),
                    confidence: parseInt(fields[15]),
                    supplierType: fields[16],
                    chainCodeId: fields[18] ? parseInt(fields[18]) : null,
                    regionId: parseInt(fields[19])
                },
                images: []
            };

            var images = db.collection('images');
            images.find({'expediaHotelId': parseInt(fields[0])}, function(err, cursor) {
                if(err) {
                    console.log(err);
                }
                else {
                    cursor.toArray(function(err, array) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            for (var i = 0; i < array.length; i++) {
                                record.images.push({
                                    url : array[i].url,
                                    width : array[i].width,
                                    height : array[i].height,
                                    thumbnailUrl : array[i].thumbnailUrl,
                                    isDefault : array[i].isDefault
                                });
                            }
                            records.push(record);
                            if (records.length == threshold || isLastLine) {
                                collection.insert(records, {w:1}, function(err, result) {
                                    if (err) {
                                        console.log('insert failure');
                                    }
                                    if (isLastLine) {
                                        index = lineCount;
                                    }
                                    else {
                                        index += threshold;
                                    }
                                    console.log(index + ' records inserted');
                                    if (isLastLine) {
                                        process.exit(1);
                                    }
                                });
                                records = [];
                            }
                        }
                    });
                }
            });


        }
        lineCount++;
    });
});
