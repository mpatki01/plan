var mongoose = require("mongoose");

var Todo = new mongoose.Schema({
    name    : String,
    updated : Date
});

mongoose.model("Todo", Todo);
mongoose.connect( 'mongodb://192.168.2.6/express-todo' );