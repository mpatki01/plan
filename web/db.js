var mongoose = require("mongoose");

mongoose.connect( 'mongodb://localhost/triptacular' );
var models = [];

var Place = new mongoose.Schema({
    name    : String
});
models.push(mongoose.model("Place", Place));

var Task = new mongoose.Schema({
    name    : String,
    updated : Date
});
models.push(mongoose.model("Task", Task));

exports.models = models;