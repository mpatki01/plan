var mongoose = require( 'mongoose' );
var Todo     = mongoose.model( 'Todo' );

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express Todo Example' });
};

exports.fetch = function(req, res) {
    res.send({message: "GET handled"});
};

exports.create = function(req, res) {
    var message = "Todo Item Created.";
    var todo = new Todo(req.body);
    todo.save(function(error) {
        if (error) {
            message = "Failed to create Todo Item.";
        }
        res.send({message: message});
    })
}