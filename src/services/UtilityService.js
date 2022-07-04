/**
 * Copyright (C) Mercury Squad
 */

/**
 * the utility service
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const fs = require('fs');
const path = require('path');
const config = require('config');
const joi = require('joi');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const dayjs = require('dayjs');
const logger = require('../common/logger');
const { Invoice } = require('../models');

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

/**
 * generates the HTML content for the invoice preview
 * @param {string} invoice the invoice id
 * @returns {Promise}
 */
async function generateHTMLForInvoice(invoiceId) {
  let invoice = await Invoice.findOne({ _id: invoiceId })
    .populate(['user'])
    .populate({
      path: 'project',
      model: 'Project',
      populate: {
        path: 'client',
        model: 'Client',
      },
    });

  return convertToHTML(invoice);
}

/**
 * converts into HTML content
 * @param {Object} invoice the invoice document
 * @returns String
 */
function convertToHTML(invoice) {
  invoice = invoice.toObject();

  invoice.generatedDate = dayjs(invoice.generatedDate).format('YYYY-MM-DD');
  invoice.paymentDueDate = dayjs(invoice.paymentDueDate).format('YYYY-MM-DD');

  const fileContent = fs.readFileSync(path.join(__dirname, 'templates/invoice.html'), 'UTF8');

  const content = ejs.render(fileContent, { invoice });

  return content;
}

module.exports = {
  sendEmail,
  generateHTMLForInvoice,
};
