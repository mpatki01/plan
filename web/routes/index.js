var mongoose = require( 'mongoose' );
var Task = mongoose.model( 'Task' );

/*
 * GET home page.
 */

exports.index = function(req, res){
    Task.find({}, function (err, tasks) {
        res.render('index', { title: 'Express Todo Example', data: tasks });
    });
};