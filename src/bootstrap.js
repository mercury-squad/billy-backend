/**
 * Copyright (C) Mercury Squad
 */

/**
 * bootstrap tasks, add logger and joi to services
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const config = require('config');
const fs = require('fs');
const path = require('path');
const joi = require('joi');
const logger = require('./common/logger');
const helper = require('./common/helper');
const constants = require('./constants').default;

// joi validation
joi.id = () => joi.number().integer().min(1).required();
joi.optionalId = () => joi.number().integer().min(1);
joi.offset = () => joi.number().integer().min(0).default(0);
joi.limit = () => joi.number().integer().min(1).default(constants.DefaultQueryLimit);
joi.page = () => joi.number().integer().positive().default(Number(config.DEFAULT_PAGE_INDEX));
joi.perPage = () =>
  joi.number().integer().positive().max(Number(config.MAX_PER_PAGE)).default(Number(config.DEFAULT_PER_PAGE));
joi.sortOrder = () => joi.string().valid('asc', 'desc', 'ASC', 'DESC').default('asc');

/**
 * add logger and joi schema to services
 * @param {string} dir the directory
 */
function buildServices(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const curPath = path.join(dir, file);

    fs.stat(curPath, (err, stats) => {
      if (err) return;

      if (stats.isDirectory()) {
        buildServices(curPath);
      } else if (path.extname(file) === '.js') {
        logger.buildService(require(curPath)); // eslint-disable-line
      }
    });
  });
}

buildServices(path.join(__dirname, 'services'));
