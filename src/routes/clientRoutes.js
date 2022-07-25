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
    delete: {
      controller: 'clientController',
      method: 'deleteClientsByIds',
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
