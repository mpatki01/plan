var mongoose = require( 'mongoose' );
var Task = mongoose.model( 'Task' );

/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('search', { title: 'Triptacular Search'});
};