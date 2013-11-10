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

exports.save = function(req, res) {
    var message = "Task Item Saved.";

    // Create a new task from the request parameters.
    var task = new Task(req.body);

    // Convert the Model instance to a simple object using Model's 'toObject' function
    // to prevent weirdness like infinite looping...
    var data = task.toObject();

    // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
    delete data._id;

    // Do the upsert, which works like this: If no Task document exists with
    // _id = task_.id, then create a new doc using data.
    // Otherwise, update the existing doc with data.
    Task.update({_id: task._id}, data, {upsert: true}, function(error) {
        if (error) {
            message = "Failed to save task.";
        }
        res.send({message: message});
    });
}

exports.delete = function(req, res) {
    var message = "Task deleted."
    Task.remove({_id: req.body.id}, function(error) {
        message = "Failed to delete task."
    })
    res.send({message: message});
}