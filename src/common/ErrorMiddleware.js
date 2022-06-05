/**
 * Copyright (C) Mercury Squad
 */

/**
 * Common error handling middleware
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const logger = require('./logger');
const errors = require('common-errors');
const httpStatus = require('http-status');

// default message to show on error
const DEFAULT_MESSAGE = 'Internal server error';

/**
 * The error middleware function
 * @param {Object} err the error that is thrown in the application
 * @param {Object} req the express request instance
 * @param {Object} res the express response instance
 * @param {Function} next the next middleware in the chain
 */
function middleware(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  logger.logFullError(err, req.method, req.url);

  let errorStatus;
  let errorMessage;

  if (err.isJoi) {
    errorStatus = httpStatus.BAD_REQUEST;
    errorMessage = err.details;
    res.status(errorStatus).json({
      message: errorMessage,
    });
  } else if (err.errors) {
    errorStatus = httpStatus.BAD_REQUEST;
    errorMessage = err.errors;
    res.status(errorStatus).json({ message: errorMessage });
  } else {
    const httpError = new errors.HttpStatusError(err);

    if (err.statusCode >= httpStatus.INTERNAL_SERVER_ERROR) {
      httpError.message = DEFAULT_MESSAGE;
    }

    errorStatus = httpError.statusCode;
    errorMessage = httpError.message || DEFAULT_MESSAGE;
    res.status(errorStatus).json({ message: errorMessage });
  }
}

module.exports = () => middleware;
