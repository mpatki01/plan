/*jslint
    node
*/

'use strict';

var express = require('express'),
    app = express(),
    expressConfig = require('./configs/express-config'),
    serverConfig = require('./configs/server-config'),
    http = require('http'),
    server = null;

expressConfig.configure(app, __dirname);
server = http.createServer(app);
serverConfig.configure(server);
