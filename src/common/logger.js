/**
 * Copyright (C) Mercury Squad
 */

/**
 * This module contains the winston logger configuration.
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const winston = require('winston');
const Joi = require('joi');
const util = require('util');
const config = require('config');
const getParams = require('get-parameter-names');
const _ = require('lodash');

const transports = [];

if (!config.DISABLE_LOGGING) {
  transports.push(new winston.transports.Console({ level: config.LOG_LEVEL }));
}

const logger = winston.createLogger({ transports });

/**
 * Log error details with signature
 * @param {Object} err the error
 * @param {Object} signature the signature
 */
logger.logFullError = (err, signature) => {
  if (!err || err.logged) {
    return;
  }

  logger.error(`Error happened in ${signature}\n${err.stack}`);
  err.logged = true; // eslint-disable-line no-param-reassign
};

/**
 * Convert array with arguments to object
 * @param {Array} params the name of parameters
 * @param {Array} arr the array with values
 * @returns {Object} the combined object
 * @private
 */
function combineObject(params, arr) {
  const ret = {};

  _.forEach(arr, (arg, i) => {
    ret[params[i]] = arg;
  });

  return ret;
}

/**
 * Remove invalid properties from the object and hide long arrays
 * @param {Object} obj the object
 * @returns {Object} the new object with removed properties
 * @private
 */
function sanitizeObject(obj) {
  try {
    return JSON.parse(
      JSON.stringify(obj, (name, value) => {
        // Array of field names that should not be logged
        // add field if necessary (password, tokens etc)
        const removeFields = ['token', 'password'];

        if (_.indexOf(removeFields, name) > -1) {
          return '<removed>';
        }

        if (_.isArray(value) && value.length > 30) {
          return `Array(${value.length})`;
        }

        return value;
      })
    );
  } catch (e) {
    return obj;
  }
}

/**
 * Decorate all functions of a service and validate input values
 * and replace input arguments with sanitized result form Joi
 * Service method must have a `schema` property with Joi schema
 * @param {Object} service the service
 */
logger.decorateWithValidator = (service) => {
  _.forEach(service, (method, name) => {
    if (!method.schema) {
      return;
    }

    const params = getParams(method);
    service[name] = async function serviceMethodWithLogging() {
      // eslint-disable-line no-param-reassign
      const args = Array.prototype.slice.call(arguments); // eslint-disable-line
      const value = combineObject(params, args);
      const normalized = Joi.attempt(value, method.schema);

      const newArgs = [];
      // Joi will normalize values
      // for example string number '1' to 1
      // if schema type is number
      _.forEach(params, (param) => {
        newArgs.push(normalized[param]);
      });

      const methodValue = await method.apply(this, newArgs);
      return methodValue;
    };
    service[name].params = params; // eslint-disable-line no-param-reassign
  });
};

/**
 * Decorate all functions of a service and log debug information if DEBUG is enabled
 * @param {Object} service the service
 */
logger.decorateWithLogging = (service) => {
  if (config.LOG_LEVEL !== 'debug') {
    return;
  }

  _.forEach(service, (method, name) => {
    const params = method.params || getParams(method);
    service[name] = async function serviceMethodWithLogging() {
      // eslint-disable-line no-param-reassign
      logger.debug(`ENTER ${name}`);
      logger.debug('input arguments');
      const args = Array.prototype.slice.call(arguments); // eslint-disable-line
      logger.debug(util.inspect(sanitizeObject(combineObject(params, args))));
      try {
        const result = await method.apply(this, arguments); // eslint-disable-line
        logger.debug(`EXIT ${name}`);

        if (result !== null && result !== undefined) {
          logger.debug('output arguments');
          logger.debug(util.inspect(sanitizeObject(result)));
        }

        return result;
      } catch (e) {
        logger.logFullError(e, name);
        throw e;
      }
    };
  });
};

/**
 * Apply logger and validation decorators
 * @param {Object} service the service to wrap
 */
logger.buildService = (service) => {
  logger.decorateWithValidator(service);
  logger.decorateWithLogging(service);
};

module.exports = logger;
