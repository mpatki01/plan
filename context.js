
var Context = function(model) {

    this.save = function (req, res) {
        var message = "Task Item Saved.";

        // Create a new model using the model's constructor.
        var item = model.prototype.constructor(req.body);

        // Convert the Model instance to a simple object using Model's 'toObject' function
        // to prevent weirdness like infinite looping...
        var data = item.toObject();

        // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
        delete data._id;

        // Do the upsert, which works like this: If no Task document exists with
        // _id = task_.id, then create a new doc using data.
        // Otherwise, update the existing doc with data.
        model.update({_id: item._id}, data, {upsert: true}, function(error) {
            if (error) {
                message = "Failed to save task.";
            }
            res.send({message: message});
        });
    };

};



exports.init = function(model) {
    return new Context(model);
};