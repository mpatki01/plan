var mongoose = require( 'mongoose' );
var Task = mongoose.model( 'Task' );

/**
 * Gets all task items.
 * @param req
 * @param res
 */
exports.getAll = function(req, res) {
    Task.find({}, function (err, tasks) {
        var map = {};
        tasks.forEach(function (task) {
            map[task._id] = task;
        });
        res.send(map);
    });
};

exports.getById = function(req, res) {
    res.send({message: "GET handled"});
}

exports.create = function(req, res) {
    var message = "Task Item Created.";
    var task = new Task(req.body);
    task.save(function(error) {
        if (error) {
            message = "Failed to create Todo Item.";
        }
        res.send({message: message});
    })
}

exports.update = function(req, res) {
    res.send({message: "PUT handled"});
}

exports.delete = function(req, res) {
    res.send({message: "DELETE handled"});
}