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
    /*
    var task = req.body;
    if (req.body._id) {
        delete task._id;
    }
    else {
        task._id = mongoose.Types.ObjectId();
        req.body._id = task._id;
    }
    */
    var task = new Task(req.body);
    var data = task.toObject();
    delete data._id;
    Task.update({_id: task._id}, data, {upsert: true}, function(error) {
        if (error) {
            message = "Failed to save Todo Item.";
        }
        res.send({message: message});
    });
    /*
    task.save(function(error) {
        if (error) {
            message = "Failed to save Todo Item.";
        }
        res.send({message: message});
    })
    */
}

exports.delete = function(req, res) {
    res.send({message: "DELETE handled"});
}