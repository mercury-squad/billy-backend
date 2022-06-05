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
      controller: 'UserController',
      method: 'changePassword',
    },
  },
  '/user/me': {
    get: {
      controller: 'UserController',
      method: 'userProfile',
    },
    put: {
      controller: 'UserController',
      method: 'updateProfile',
    },
  },
};
