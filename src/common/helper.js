/**
 * Copyright (C) Mercury Squad
 */

/**
 * Contains generic helper methods
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const co = require('co');
const bcrypt = require('bcryptjs');
const config = require('config');
const httpStatus = require('http-status');
const _ = require('lodash');
const fs = require('fs');
const errors = require('common-errors');
const logger = require('../common/logger');

/**
 * Wrap async function to standard express function
 * @param {Function} fn the async function
 * @returns {Function} the wrapped function
 */
function wrapExpress(fn) {
  return (req, res, next) => co(fn(req, res, next)).catch(next);
}

/**
 * add toObject transform to mongoose schema
 * @param schema Mongoose Schema
 * @param transformFunc the toObject transform function
 */

/* eslint-disable no-param-reassign */
function pluginSchemaToObject(schema, transformFunc) {
  if (!schema.options.toObject) {
    schema.options.toObject = {};
  }

  if (!transformFunc) {
    transformFunc = (doc, ret) => {
      const sanitized = _.omit(ret, '__v', '_id');
      sanitized.id = doc._id;
      return sanitized;
    };
  }

  schema.options.toObject.transform = transformFunc;
}

/**
 * Validate that the hash is actually the hashed value of plain text
 * @param {String} text the text to validate
 * @param {String} hash the hash to validate
 * @returns {Boolean} whether it is valid or not
 */
function validateHash(text, hash) {
  const value = bcrypt.compareSync(text, hash);
  return value;
}

/**
 * Wrap all async from object
 * @param {Object} obj the object (controller exports)
 * @returns {Object|Array} the wrapped object
 */
function autoWrapExpress(obj) {
  if (_.isArray(obj)) {
    return obj.map(autoWrapExpress);
  }

  if (_.isFunction(obj)) {
    if (obj.constructor.name === 'AsyncFunction') {
      return wrapExpress(obj);
    }
    return obj;
  }

  _.each(obj, (value, key) => {
    obj[key] = autoWrapExpress(value);
  });

  return obj;
}

/**
 * Helper method to sanitize the Array
 * Sanitization means convert the mongoose model into plain javascript object
 *
 * @param arry the array to sanitize
 * @param method the sanitize method
 */
function sanitizeArray(arry, method) {
  const newMethod = method || 'toObject';

  if (_.isArray(arry)) {
    const response = [];
    _.forEach(arry, (single) => {
      response.push(single[newMethod]());
    });
    return response;
  }

  return arry.toObject();
}

/**
 * Hash the given text.
 * @param {String} passwordText the password text to hash
 * @returns {String} the hashed string
 */
function hashString(passwordText) {
  const value = bcrypt.hashSync(passwordText, config.PASSWORD_HASH_SALT_LENGTH);
  return value;
}

/**
 * get a random string
 * @param {number} length the length
 * @param {String} characters the characters
 * @returns {String} the random string
 */
function getRandomString(length, characters) {
  const newLength = length || 40;
  const $characters = characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!';
  let text = '';

  for (let i = 0; i < newLength; i += 1) {
    text += $characters.charAt(Math.floor(Math.random() * $characters.length));
  }

  return text;
}

/**
 * get host url with api version, example `http://localhost:3000/api/v1`
 * @returns {String} the url
 */
function getHostUrlWithApiVersion() {
  return `${config.HOST_URL}${config.API_VERSION}`;
}

/**
 * get frontend url, example `http://localhost:4200`
 * @returns {String} the url
 */
function getFrontendUrl() {
  return `${config.FRONTEND_URL}`;
}

/**
 * checks if entity exists or not
 * @param {Object} model the model
 * @param {Object} query the query
 * @param {string} message the error message
 * @returns {Object} the found entity
 */
async function ensureEntityExists(model, query, message) {
  const entity = await model.findOne(query);

  if (!entity) {
    throw new errors.NotFoundError(message || `cannot find entity where: ${JSON.stringify(query)}`);
  }

  return entity;
}

/**
 * check if value  exist or not.
 * @param {Object} model the model
 * @param {Object} query the query
 * @param {String} value the value
 */
async function ensureValueIsUnique(model, query, value) {
  const entity = await model.findOne(query);

  if (entity) {
    throw new errors.HttpStatusError(httpStatus.CONFLICT, `${value} already exists`);
  }
}

/**
 * checks if user has entity access or not
 * @param {Object} model the model
 * @param {Object} query the model
 * @param {String} userId the user id
 * @param {String} message the message
 * @returns {Object} the found entity
 */
async function ensureEntityAccess(model, query, userId, message) {
  const entity = await model.findOne(query);

  if (!entity) {
    throw new errors.NotFoundError(`cannot find entity where: ${JSON.stringify(query)}`);
  }

  if (entity.createdBy.toString() !== userId) {
    throw new errors.NotPermittedError(message);
  }

  return entity;
}

/**
 * ensures that folder exists in the path
 * @param {String} folderPath the folder path
 */
async function ensureDirectoryExists(folderPath) {
  // create directory
  if (!fs.existsSync(folderPath)) {
    throw new errors.NotFoundError(`the directory ${folderPath} not exists`);
  }
}

/**
 * create directory
 * @param {String} directory the directory
 */
async function createDirectory(directory) {
  if (!fs.existsSync(directory)) {
    await fs.mkdirSync(directory);
  }
}

/**
 * removes files from directory
 * @param {String} directory the directory
 */
async function removeDirectoryFiles(directory) {
  try {
    await ensureDirectoryExists(directory);
    const files = await fs.readdirSync(directory);
    const unlinkPromises = files.map((filename) => fs.unlinkSync(`${directory}/${filename}`));
    await Promise.all(unlinkPromises);
  } catch (ex) {
    logger.error(ex);
    throw ex;
  }
}

/**
 * ensures if user is verified
 * @param {Object} user the user
 */
function ensureUserVerified(user) {
  if (!user.verified) {
    throw new errors.NotPermittedError(`email ${user.email} is not verified`);
  }
}

module.exports = {
  pluginSchemaToObject,
  validateHash,
  autoWrapExpress,
  hashString,
  sanitizeArray,
  getRandomString,
  getHostUrlWithApiVersion,
  ensureEntityExists,
  ensureUserVerified,
  ensureValueIsUnique,
  ensureEntityAccess,
  ensureDirectoryExists,
  createDirectory,
  removeDirectoryFiles,
  getFrontendUrl,
};
