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
        $.get("/fetch", {}, function(data) {
            $("#msg").text(data.message);
            vm.task().updated(new Date());
            var original = vm.task();
            vm.tasks.push(vm.task());
            vm.task(new Task());
            $.ajax({
                type: 'POST',
                data: ko.toJSON(original),
                contentType: 'application/json',
                url: '/create',
                success: function(data) {
                    console.log('success');
                    console.log(JSON.stringify(data));
                    $("#msg").text(data.message);
                }
            })
        });
    }

    var TasksViewModel = function() {
        this.tasks = ko.observableArray();
        this.task = ko.observable(new Task());
    };

    TasksViewModel.prototype.delete = function(task) {
        this.tasks.remove(task);
    };

    var vm = new TasksViewModel();
    ko.applyBindings(vm);

})(ko)

