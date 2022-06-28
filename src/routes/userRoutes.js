/**
 * Copyright (C) Mercury Squad
 */

/**
 * the User Routes
 *
 * @author      Mercury Squad
 * @version     1.0
 */

module.exports = {
  '/user/password': {
    post: {
      controller: 'userController',
      method: 'changePassword',
    },
  },
  '/user/me': {
    get: {
      controller: 'userController',
      method: 'userProfile',
    },
    put: {
      controller: 'userController',
      method: 'updateProfile',
    },
  },
};
