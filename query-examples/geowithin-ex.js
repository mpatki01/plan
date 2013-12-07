var features = ['resort','hotel','airport'];
var miles = 2;
var RADIUS = 3959;
var distance = miles / RADIUS;

var louisville = db.places.findOne({
    tags: {'$all': ['louisville', 'us', 'kentucky']}
});

db.places.find({
    tags: {'$in': features}, 
    loc : {
        '$geoWithin': {
            '$centerSphere': [louisville.loc, distance]
         }
    }
})