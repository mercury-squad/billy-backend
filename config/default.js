/**
 * Copyright (C) Mercury Squad
 */

/**
 * the default config
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  HOST_URL: process.env.HOST || 'http://localhost:3200',
  FRONTEND_URL: process.env.FRONTEND || 'http://localhost:4200',
  PORT: process.env.PORT || 3200,
  API_VERSION: process.env.API_VERSION || '/api/v1',
  PASSWORD_HASH_SALT_LENGTH:
    (process.env.PASSWORD_HASH_SALT_LENGTH && Number(process.env.PASSWORD_HASH_SALT_LENGTH)) || 10,
  JWT_SECRET: process.env.JWT_SECRET || 'hjijfvbw859',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '100 days',
  email: {
    pool: true,
    host: process.env.EMAIL_SERVER || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true, // use TLS
    auth: {
      user: process.env.EMAIL_USER || 'usertotestmail@gmail.com',
      pass: process.env.EMAIL_PASS || 'UserTest@1234',
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
