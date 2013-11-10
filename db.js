var mongoose = require("mongoose");

var Task = new mongoose.Schema({
    name    : String,
    updated : Date
});

mongoose.model("Task", Task);
mongoose.connect( 'mongodb://192.168.2.6/express-todo' );