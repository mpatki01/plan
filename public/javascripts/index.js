(function(ko) {

    var Task = function(options) {
        var self = this;
        options = options || {};
        self._id = ko.observable(options._id);
        self.name = ko.observable(options.name);
        self.updated = ko.observable(options.updated);
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
        $.ajax({
            type: 'POST',
            data: ko.toJSON(this),
            contentType: 'application/json',
            url: '/task/save',
            success: function(data) {
                console.log('success');
                console.log(JSON.stringify(data));
                $("#msg").text(data.message);
            }
        })
        this.updatable(false);
    }

    Task.prototype.add = function() {
        $.get("/tasks", {}, function(data) {
            vm.task().updated(new Date());
            var original = vm.task();
            vm.tasks.push(vm.task());
            vm.task(new Task());
            $.ajax({
                type: 'POST',
                data: ko.toJSON(original),
                contentType: 'application/json',
                url: '/task/save',
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
        this.init();
    };

    TasksViewModel.prototype.init = function() {
        for (var i = 0; i < data.length; i++) {
            var task = new Task({
                _id : data[i]._id,
                name : data[i].name,
                updated : data[i].updated
            });
            this.tasks.push(task);
        }
    }

    TasksViewModel.prototype.delete = function(task) {
        this.tasks.remove(task);
    };

    var vm = null;
    $(document).ready(function() {
        vm = new TasksViewModel();
        ko.applyBindings(vm);
    })

})(ko)

