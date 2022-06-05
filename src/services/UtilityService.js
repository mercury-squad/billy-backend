/**
 * Copyright (C) Mercury Squad
 */

/**
 * the utility service
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const config = require('config');
const joi = require('joi');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const logger = require('../common/logger');

const transporter = nodemailer.createTransport(_.extend(config.email, { logger }), {
  from: `${config.email.auth.user}`,
});

/**
 * sends email to the provided email id
 * @param {Object} emailEntity the email entity
 * @returns {Promise}
 */
async function sendEmail(emailEntity) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(emailEntity, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

sendEmail.schema = {
  emailEntity: joi
    .object()
    .keys({
      to: joi.string().required(),
      subject: joi.string().required(),
      text: joi.string(),
      html: joi.string(),
    })
    .required(),
};

module.exports = {
  sendEmail,
};
