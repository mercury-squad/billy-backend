/**
 * Copyright (C) Mercury Squad
 */

/**
 * the default config
 *
 * @author      Mercury Squad
 * @version     1.0
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  HOST_URL: process.env.HOST || 'http://localhost:3200',
  FRONTEND_URL: process.env.FRONTEND || 'http://localhost:3000',
  PORT: process.env.PORT || 3200,
  API_VERSION: process.env.API_VERSION || '/api/v1',
  PASSWORD_HASH_SALT_LENGTH:
    (process.env.PASSWORD_HASH_SALT_LENGTH && Number(process.env.PASSWORD_HASH_SALT_LENGTH)) || 10,
  JWT_SECRET: process.env.JWT_SECRET || 'hjijfvbw859',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '100 days',

  // default page, Page starts at 1
  DEFAULT_PAGE_INDEX: process.env.DEFAULT_PAGE_INDEX || 1,
  // page size
  DEFAULT_PER_PAGE: process.env.DEFAULT_PER_PAGE || 20,
  // max page size
  MAX_PER_PAGE: process.env.MAX_PER_PAGE || 100,

  // Invoice
  INVOICE_NUMBER_PREFIX: process.env.INVOICE_NUMBER_PREFIX || 'INV',
  CONCURRENT_INVOICE_TO_SEND: process.env.CONCURRENT_INVOICE_TO_SEND || 5,
  CONCURRENT_INVOICE_TO_CHECK: process.env.CONCURRENT_INVOICE_TO_CHECK || 15,
  // crontab format interval (run every 20 seconds)
  CRON_JOB_RUNTIME_EXPRESSION: process.env.CRON_JOB_RUNTIME_EXPRESSION || '*/20 * * * * *',

  emailVerificationContent: `Dear %s<br/> <br/>
  Thank you for signing up to Billy. Please click on this <a href="%s">link</a> which will validate the email address 
  that you used to register. Once you click on this link you are ready to log in. We look forward to talking with you soon.
  <br/> <br/>If any questions or problems, please call (000) 000-0000 Or email to support@billy.com`,
  forgotPasswordContent: `Dear %s<br/> <br/>
  Please click on this <a href="%s">link</a> which will guide you through the process of changing the password.
  <br/> <br/>If any questions or problems, please call (000) 000-0000 Or email to support@billy.com`,
  invoiceContent: `Dear %s<br/> <br/>
  Please find the below attached invoice for the latest payment.
  <br/> <br/>If any questions or problems, please call (000) 000-0000 Or email to support@billy.com`,

  email: {
    pool: true,
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: true, // use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true, // include SMTP traffic in the logs
  },

  db: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/billy',
    poolSize: 5,
    settings: {
      reconnectTries: Number.MAX_VALUE,
      autoReconnect: true,
    },
  },
};
