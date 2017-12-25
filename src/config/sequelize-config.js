/*jslint
    node
*/

'use strict';

var Sequelize = require('sequelize'),
    sequelize = new Sequelize('main', null, null, {
        dialect: 'sqlite',
        storage: 'C:\\Users\\mike\\Projects\\plan\\src\\files.db'
    }),
    details = require('../models/details'),
    db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.details = details.init(sequelize, Sequelize);

module.exports = db;
