/**
 * Copyright (C) Mercury Squad
 */

/**
 * the invoice email service
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const fs = require('fs');
const _ = require('lodash');
const config = require('config');
const dayjs = require('dayjs');
const pdf = require('html-pdf');
const util = require('util');
const { Invoice } = require('../models');
const { generateHTMLForInvoice, sendEmail } = require('./utilityService');
const { InvoiceStatus } = require('../constants');
const logger = require('../common/logger');

/**
 *
 * @returns Promise
 */
async function sendInvoiceEmails() {
  try {
    let invoices = await Invoice.find({
      //query today up to this time
      createdAt: {
        $lte: new Date(),
      },

      status: InvoiceStatus.scheduled,
    })
      .populate(['user'])
      .populate({
        path: 'project',
        model: 'Project',
        populate: {
          path: 'client',
          model: 'Client',
        },
      })
      .limit(config.CONCURRENT_INVOICE_TO_SEND);

    logger.info(`******* Found ${invoices.length} document/documents *******`);

    // for each invoice that is in scheduled state, send the email and
    // change the status to sent
    invoices.forEach(async (invoice) => {
      const fileName = invoice.invoiceNumber + '_' + dayjs(invoice.generatedDate).format('YYYY-MM-DD');

      logger.info(`******* Sending invoice for ${fileName} *******`);

      // this is the content of the email body
      const emailContent = util.format(config.invoiceContent, invoice.project.client.email);

      const createdFile = await createPDFFileForInvoice(invoice, fileName);

      const emailEntity = {
        subject: 'Your Invoice',
        to: invoice.project.client.email,
        html: emailContent,
        cc: invoice.user.email,
        attachments: [
          {
            filename: fileName + '.pdf',
            path: './temp' + createdFile.filename.split('temp')[1],
          },
        ],
      };

      await sendEmail(emailEntity);

      fs.rmSync('./temp/' + createdFile.filename.split('/')[2], { recursive: true, force: true });

      _.assignIn(invoice, { status: InvoiceStatus.sent });

      await invoice.save();
    });

    return invoices.length;
  } catch (error) {
    logger.error(`******* Error while sending invoice for ${fileName} *******`);
  }
}

/**
 * creates pdf file for each invoice
 * @param {Object} invoice the invoice object
 * @param {String} fileName the filename
 * @returns {Promise}
 */
async function createPDFFileForInvoice(invoice, fileName) {
  const HTMLContent = await generateHTMLForInvoice(invoice._id);

  let options = {
    directory: `./temp/${fileName}`,
    type: 'pdf',
    orientation: 'portrait',
    width: '1020px',
    height: '1460px',
  };

  const create = util.promisify(pdf.create);

  const createdFile = await create(HTMLContent, options);

  return createdFile;
}

module.exports = {
  sendInvoiceEmails,
};
