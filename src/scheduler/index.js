require('dotenv').config();
require('../bootstrap');

const schedule = require('node-schedule');
const config = require('config');
const invoiceEmailService = require('../services/invoiceEmailService');
const invoiceService = require('../services/invoiceService');
const logger = require('../common/logger');

/**
 * Schedules the job for sending invoices/emails
 */
schedule.scheduleJob(config.CRON_JOB_RUNTIME_EXPRESSION, async function () {
  logger.info('******* Initiating the scheduler for sending  invoices/emails *******');

  const numberOfEmailsSent = await invoiceEmailService.sendInvoiceEmails();
  logger.info(`Automatically sent ${numberOfEmailsSent} emails`);
});

/**
 * Schedules the job for checking invoice payment due date and updating the status
 */
schedule.scheduleJob(config.CRON_JOB_RUNTIME_EXPRESSION, async function () {
  logger.info('******* Initiating the scheduler for checking invoice payment due date *******');

  const invoicesUpdated = await invoiceService.checkPaymentDueDateAndUpdate();

  logger.info(`Automatically updated ${invoicesUpdated} invoices`);
});

async function stopInvoiceEmailSchedular() {
  await schedule.gracefulShutdown();
}

module.exports = {
  stopInvoiceEmailSchedular,
};
