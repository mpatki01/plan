
var miles = 2;
var RADIUS = 3959;
var distance = miles / RADIUS;

var louisville = db.places.findOne({
    tags: {'$all': ['louisville', 'us', 'kentucky']}
});


db.properties.find({
    location : {
        '$geoWithin': {
            '$centerSphere': [louisville.loc, distance]
         }
    }
})
