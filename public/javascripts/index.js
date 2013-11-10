var AppViewModel = function() {
    var self = this;
    self.name = ko.observable("");
    self.salutation = ko.observable("");
    self.greeting = ko.computed(self.greeting, self);
}

AppViewModel.prototype.greeting = function() {
    var greeting = "";
    if (this.name()) {
        greeting = "Hello, " + this.name();
    }
    return greeting;
};

AppViewModel.prototype.sayHello = function() {
    if (this.name()) {
        this.salutation("Hello, " + this.name());
    }
};

ko.applyBindings(new AppViewModel());
