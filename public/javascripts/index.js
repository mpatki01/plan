var Task = function(name, updated) {
    this.name = ko.observable(name);
    this.updated = ko.observable(updated);
    this.updatable = ko.observable(false);
};

var TasksViewModel = function() {
    this.tasks = ko.observableArray([]);
    this.nameToAdd = ko.observable("");
};

TasksViewModel.prototype.add = function () {
    if (this.nameToAdd()) {
        var task = new Task(this.nameToAdd(), new Date());
        this.tasks.push(task);
        this.nameToAdd("");
    }
};

TasksViewModel.prototype.edit = function(task) {
    var index = this.tasks.indexOf(task);
    var tasks = this.tasks();
    var task = tasks[index];
    task.updatable(true);
};

TasksViewModel.prototype.save = function(task) {
    var index = this.tasks.indexOf(task);
    var tasks = this.tasks();
    var task = tasks[index];
    task.updatable(false);
}

/**
 * Removes a task from the list.
 *
 * @param task The task to remove.
 * @remark The context has to be bound explicitly see
 *         (http://www.knockmeout.net/2013/06/knockout-debugging-strategies-plugin.html)
 */
TasksViewModel.prototype.removeTask = function(task) {
    this.tasks.remove(task);
};

ko.applyBindings(new TasksViewModel());
