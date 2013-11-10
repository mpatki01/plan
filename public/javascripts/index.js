var Task = function(name, updated) {
    var self = this;
    self.name = ko.observable(name);
    self.updated = ko.observable(updated);
};

var TasksViewModel = function() {
    var self = this;
    self.tasks = ko.observableArray([]);
    self.nameToAdd = ko.observable("");
    /*
    self.removeTask = function(task) {
        self.tasks.remove(task);
    }
    */
};

TasksViewModel.prototype.add = function () {
    var self = this;
    if (self.nameToAdd()) {
        var task = new Task(self.nameToAdd(), new Date());
        self.tasks.push(task);
        self.nameToAdd("");
    }
};

/**
 * Removes a task from the list.
 *
 * @param task The task to remove.
 * @remark The context has to be bound explicitly see
 *         (http://www.knockmeout.net/2013/06/knockout-debugging-strategies-plugin.html)
 */
TasksViewModel.prototype.removeTask = function(task) {
    var self = this;
    self.tasks.remove(task);
};

ko.applyBindings(new TasksViewModel());
