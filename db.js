var context = require('./context');
var mongoose = require("mongoose");

mongoose.connect( 'mongodb://192.168.2.2/express-todo' );

var Task = new mongoose.Schema({
    name    : String,
    updated : Date
});
var TaskModel = mongoose.model("Task", Task);
var TaskContext = context.init(TaskModel);
exports.taskContext = TaskContext;
