var mongoose = require("mongoose");
var express = require("express");

var Service = function(model, app, options) {

    var options = options || {};
    var api = options.api || "/api/";
    var version = options.version || "v1/";
    var pluralized = options.pluralized || model.modelName + "s";
    var url = api + version + pluralized;
    var slug = options.slug || "/:id";

    var save = function (req, res) {
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
            data._id = item._id;
            res.send(data);
        });
    };

    var remove = function(req, res) {
        var message = "Task deleted."
        model.remove({_id: req.params.id}, function(error) {
            message = "Failed to delete task."
        })
        res.send({message: message});
    };

    app.post(url, save);
    app.put(url + slug, save);
    app.delete(url + slug, remove);
};


exports.serve = function(app, models, options) {
    var services = [];
    if (app && models) {
        for (var i = 0; i < models.length; i++) {
            var config = {};
            var name = models[i].modelName;
            if (options && options[name]) {
                config = options[name];
            }
            services.push(new Service(models[i], app, config));
        }
    }
    return services;
};