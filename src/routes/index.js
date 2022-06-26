/**
 * Copyright (C) Mercury Squad
 */

/**
 * Defines the API routes
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const express = require('express');
const { expressjwt } = require('express-jwt');
const _ = require('lodash');
const config = require('config');
const multer = require('multer');
const errors = require('common-errors');
const securityRoutes = require('./securityRoutes');
const UserRoutes = require('./UserRoutes');
const InvoiceRoutes = require('./invoiceRoutes');
const helper = require('../common/helper');
const logger = require('../common/logger');
const models = require('../models');

const upload = multer({
  dest: './upload',
});

const apiRouter = express.Router();

const routes = _.extend({}, securityRoutes, UserRoutes, InvoiceRoutes);

// load all routes
_.each(routes, (verbs, url) => {
  _.each(verbs, (def, verb) => {
    const actions = [
      (req, res, next) => {
        req.signature = `${def.controller}#${def.method}`;
        next();
      },
    ];

    const method = require(`../controllers/${def.controller}`)[def.method]; // eslint-disable-line

    if (!method) {
      throw new Error(`${def.method} is undefined, for controller ${def.controller}`);
    }

    if (!def.public) {
      // authentication
      actions.push(
        expressjwt({
          secret: config.JWT_SECRET,
          algorithms: ['HS256'],
        })
      );

      actions.push(async (req, res, next) => {
        const user = await models.User.findOne({
          email: req.auth?.email,
        });
        // setting user manually since the credentials are saved in
        // req.auth instead of req.user
        req.user = user;

        if (!req.user) {
          return next(new errors.AuthenticationRequiredError('Authorization failed.'));
        }

        return next();
      });

      // check auth token is there in db or not
      actions.push(async (req, res, next) => {
        try {
          let user = await models.User.findOne({
            _id: req.user.id,
          });

          if (!user.accessToken) {
            return next(new errors.AuthenticationRequiredError('token is invalid'));
          }
        } catch (ex) {
          return next(new errors.ValidationError('token is invalid'));
        }

        return next();
      });

      // authorization
      if (def.roles && def.roles.length > 0) {
        actions.push((req, res, next) => {
          if (_.indexOf(def.roles, req.user.role) < 0) {
            next(new errors.NotPermittedError('Invalid role.'));
          } else {
            next();
          }
        });
      }
    }

    if (def.upload) {
      actions.push(upload.single('file'));
    }

    actions.push(method);

    logger.info(`API : ${verb.toLocaleUpperCase()} ${config.API_VERSION}${url}`);

    apiRouter[verb](url, helper.autoWrapExpress(actions));
  });
});

module.exports = apiRouter;
