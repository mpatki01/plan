var mongoose = require("mongoose");

var Todo = new mongoose.Schema({
    content    : String,
    updated_at : Date
});

mongoose.model("Todo", Todo);
mongoose.connect( 'mongodb://192.168.2.6/express-todo' );