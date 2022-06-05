/**
 * Copyright (C) Mercury Squad
 */

/**
 * the mongoose db schema and init models
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const config = require('config');
const db = require('../datasource').getDb(config.db.url, config.db.poolSize);
const UserSchema = require('./User').UserSchema;

module.exports = {
  User: db.model('User', UserSchema),
  db,
};
