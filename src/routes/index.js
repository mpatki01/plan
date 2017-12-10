/*jslint
    node
*/

'use strict';

var express = require('express'),
    router = express.Router();

// Renders the Home page
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

module.exports = router;
