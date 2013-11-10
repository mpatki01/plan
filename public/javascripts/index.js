(function(ko) {

    var Task = function() {
        var self = this;
        self.name = ko.observable();
        self.updated = ko.observable();
        self.updatable = ko.observable(false);
        self.nameNotNull = ko.computed(function() {
            return self.name() !== undefined && self.name().length > 0;
        }, self)
    };

    Task.prototype.edit = function() {
        this.updatable(true);
    }

    Task.prototype.save = function() {
        this.updated(new Date());
        this.updatable(false);
    }

    Task.prototype.add = function() {
        vm.task().updated(new Date());
        vm.tasks.push(vm.task());
        vm.task(new Task());
    }

    var TasksViewModel = function() {
        this.tasks = ko.observableArray();
        this.task = ko.observable(new Task());
    };

    TasksViewModel.prototype.add = function () {
        this.task().updated(new Date());
        this.tasks.push(this.task());
        this.task(new Task());
    };

    TasksViewModel.prototype.delete = function(task) {
        this.tasks.remove(task);
    };

    var vm = new TasksViewModel();
    ko.applyBindings(vm);

})(ko)

