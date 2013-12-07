var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server;
var databaseName = 'triptacular';
var mongoClient = new MongoClient(new Server('localhost', 27017));

mongoClient.open(function(err, mongoClient) {
    var db = mongoClient.db(databaseName);
    db.ensureIndex('places', { 'loc' : '2d' }, function(err, name) {
        if (err) {
            console.log(err);
        }

        db.ensureIndex('places', 'tags', function(err, name) {
            if (err) {
                console.log(err);
            }
     
            process.exit(0);
        });
    });

});
