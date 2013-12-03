var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server;
var fs = require('fs');
var lineReader = require('line-reader');
var databaseName = 'triptacular';
var mongoClient = new MongoClient(new Server('localhost', 27017));
var filename = '/home/mike/data/US.txt';
var inStream = fs.createReadStream(filename, {flags:'r'});
var records = [];
var threshold = 30000;

mongoClient.open(function(err, mongoClient) {
    var db = mongoClient.db('triptacular');
    var collection = db.collection('geonames');
    var index = 0;
    var records = [];
    var lineCount = 0;
    lineReader.eachLine(filename, function(line, isLastLine) {
        var fields = line.split('\t');
        var record = {
            geonameId : fields[0],
            name : fields[1],
            asciiName : fields[2],
            alternateNames : fields[3],
            loc : [fields[5],fields[4]],
            featureClass : fields[6],
            featureCode : fields[7],
            countryCode  : fields[8],
            cc2	: fields[9],
            admin1 : fields[10],
            admin2 : fields[11],
            admin3 : fields[12],
            admin4 : fields[13],
            population : fields[14],
            elevation : fields[15],
            dem : fields[16],
            timezone : fields[17],
            modificationDate : fields[18]
        };
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
        lineCount++;
    });
});
