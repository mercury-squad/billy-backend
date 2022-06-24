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
const InvoiceSchema = require('./Invoice').InvoiceSchema;
const ProjectSchema = require('./Project').ProjectSchema;
const ClientSchema = require('./Client').ClientSchema;

module.exports = {
  User: db.model('User', UserSchema),
  Invoice: db.model('Invoice', InvoiceSchema),
  Project: db.model('Project', ProjectSchema),
  Client: db.model('Client', ClientSchema),
  db,
};
