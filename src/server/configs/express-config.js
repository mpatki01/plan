/*jslint
    node
*/

'use strict';

var express = require('express'),
    globals = require('./global-config'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    db = require('./sequelize-config'),
    index = require('../routes/index'),
    details = require('../routes/details'),
    yaml = require('yamljs'),
    swaggerUi = require('swagger-ui-express'),
    swaggerDocument = null;

/**
 * Configures the express instance.
 * @param {*} app An Express middleware instance.
 */
function configure(app, directory) {

    // view engine setup
    app.set('views', path.join(directory, 'views'));
    app.set('view engine', 'pug');

    app.use(favicon(path.join(directory, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(directory, 'public')));

    // Establish all routes.
    app.use('/', index);
    details.init(app, db);

    // Configure Swagger
    swaggerDocument = yaml.load(path.join(directory, 'configs', './swagger-config.yml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Create and start the HTTP service on the port found in the environment
    // (port 3000 is default).
    app.set('port', globals.port);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}

module.exports = {
    configure: configure
};
