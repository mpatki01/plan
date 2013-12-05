/**
 * Module dependencies.
 */
var mongoose = require("./db");
var express = require('express');
var restify = require('./restify');
var routes = require('./routes');
var task = require('./routes/task');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

restify.serve(app, mongoose.models);
app.get('/', routes.index);
//app.get('/tasks', task.getAll);
//app.post('/task/save', mongoose.taskContext.save);
//app.post('/task/delete', task.delete);
app.get('/angular/tasks', task.angular);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});