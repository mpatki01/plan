var mongoose = require("mongoose");

mongoose.connect( 'mongodb://192.168.2.2/express-todo' );
var models = [];

var Task = new mongoose.Schema({
    name    : String,
    updated : Date
});
models.push(mongoose.model("Task", Task));
exports.models = models;