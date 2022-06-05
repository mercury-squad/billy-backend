/**
 * Copyright (C) Mercury Squad
 */

/**
 * the Security Routes
 *
 * @author      Mercury Squad
 * @version     1.0
 */

module.exports = {
  '/login': {
    post: { controller: 'securityController', method: 'login', public: true },
  },

  '/signUp': {
    post: { controller: 'securityController', method: 'signUp', public: true },
  },

  '/confirmEmail': {
    post: { controller: 'securityController', method: 'confirmEmail', public: true },
  },

  '/forgotPassword': {
    post: { controller: 'securityController', method: 'forgotPassword', public: true },
  },

  '/resetPassword': {
    post: { controller: 'securityController', method: 'resetPassword', public: true },
  },

  '/logout': {
    post: { controller: 'securityController', method: 'logout' },
  },
};
