/**
 * Copyright (C) Mercury Squad
 */

/**
 * the Client Routes
 *
 * @author      Mercury Squad
 * @version     1.0
 */

module.exports = {
  '/client': {
    get: {
      controller: 'clientController',
      method: 'getClientsList',
    },
    post: {
      controller: 'clientController',
      method: 'createClient',
    },
  },
  '/client/:id': {
    get: {
      controller: 'clientController',
      method: 'getClientDetails',
    },
    put: {
      controller: 'clientController',
      method: 'updateClient',
    },
  },
};
