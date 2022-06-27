/**
 * Copyright (C) Mercury Squad
 */

/**
 * the Invoice Routes
 *
 * @author      Mercury Squad
 * @version     1.0
 */

module.exports = {
  '/invoice': {
    post: { controller: 'invoiceController', method: 'create' },
    get: { controller: 'invoiceController', method: 'search' },
  },
  '/invoice/:id': {
    get: { controller: 'invoiceController', method: 'get' },
    put: { controller: 'invoiceController', method: 'update' },
    delete: { controller: 'invoiceController', method: 'remove' },
  },
};
