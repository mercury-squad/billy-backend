/**
 * Copyright (C) Mercury Squad
 */

/**
 * import static test data
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const co = require('co');
const models = require('../src/models');
const logger = require('../src/common/logger');
const helper = require('../src/common/helper');
const users = require('./data/Users.json');

co(async () => {
  // first remove all existing data
  await models.User.deleteMany({});
  // await models.Service.remove({});
  // await models.ServiceProvider.remove({});

  const passwordHash = helper.hashString('password');
  // create test data
  for (let i = 0; i <= users.length - 1; i += 1) {
    users[i].passwordHash = passwordHash;
  }

  await models.User.create(users);

  logger.info('Successfully Imported!');
  process.exit(0);
}).catch((err) => {
  logger.logFullError(err);
  process.exit(1);
});
