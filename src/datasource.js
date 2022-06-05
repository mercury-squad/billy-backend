/**
 * Copyright (C) Mercury Squad
 */

/**
 * Init mongo datasource
 *
 * @author      Mercury Squad
 * @version     1.0
 */

// The mongoose instance.
const mongoose = require('mongoose');

// The database mapping.
const dbs = {};

/**
 * Gets a db connection for a URL.
 * @param {String} url the url
 * @param {Number} poolSize the db pool size
 * @return {Object} connection for the given URL
 */
function getDb(url, poolSize) {
  const uri = `${url}`;

  if (!dbs[url]) {
    const db = mongoose.createConnection(uri, {
      useNewUrlParser: true,
    });
    dbs[url] = db;
  }

  return dbs[url];
}

/**
 * Gets the mongoose.
 * @return {Object} the mongoose instance
 */
function getMongoose() {
  return mongoose;
}

// exports the functions
module.exports = {
  getDb,
  getMongoose,
};
