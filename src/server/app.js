/*jslint
    node
*/

'use strict';

var express = require('express'),
    app = express(),
    expressConfig = require('./config/express-config'),
    serverConfig = require('./config/server-config'),
    http = require('http'),
    server = null;

expressConfig.configure(app, __dirname);
server = http.createServer(app);
serverConfig.configure(server);
