require('dotenv').config();
require('../bootstrap');

const schedule = require('node-schedule');
const config = require('config');
const invoiceEmailService = require('../services/invoiceEmailService');
const logger = require('../common/logger');

/**
 * Schedules the job for sending invoices/emails
 */
schedule.scheduleJob(config.CRON_JOB_RUNTIME_EXPRESSION, async function () {
  logger.info('******* Initiating the scheduler *******');

  const numberOfEmailsSent = await invoiceEmailService.sendInvoiceEmails();
  logger.info(`Automatically sent ${numberOfEmailsSent} emails`);
});

async function stopInvoiceEmailSchedular() {
  await schedule.gracefulShutdown();
}

module.exports = {
  stopInvoiceEmailSchedular,
};
