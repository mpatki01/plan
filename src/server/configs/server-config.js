/*jslint
    node
*/

'use strict';

var globalConfig = require('./global-config'),
    debug = require('debug')('src:server'),
    svr = null;

/**
 * Event handler for HTTP server "error" event.
 */
function onError(error) {
    var bind = '',
        port = svr.port();
    if (typeof port === 'string') {
        bind = 'Pipe ' + port;
    } else {
        bind = 'Port ' + port;
    }

    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = svr.address(),
        bind = null;
    if (typeof addr === 'string') {
        bind = 'pipe ' + addr;
    } else {
        bind = 'port ' + addr.port;
    }
    debug('Listening on ' + bind);
}

/**
 * Configures events for the Node HTTP server.
 * @param {*} server A Node HTTP Server.
 */
function configure(server) {
    svr = server;
    svr.listen(globalConfig.port);
    svr.on('error', onError);
    svr.on('listening', onListening);
}

module.exports = {
    configure: configure
};
