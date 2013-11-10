var Task = function(name, updated) {
    var self = this;
    self.name = ko.observable(name);
    self.updated = ko.observable(updated);
}

var TasksViewModel = function() {
    var self = this;
    self.tasks = ko.observableArray([]);
    self.nameToAdd = ko.observable("");
}

TasksViewModel.prototype.add = function() {
    var self = this;
    if (self.nameToAdd()) {
        var task = new Task(self.nameToAdd(), new Date());
        self.tasks.push(task);
        self.nameToAdd("");
    }
}

ko.applyBindings(new TasksViewModel());
