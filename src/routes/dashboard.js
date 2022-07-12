/**
 * Copyright (C) Mercury Squad
 */

/**
 * the Dashboard Routes
 *
 * @author      Mercury Squad
 * @version     1.0
 */

module.exports = {
  '/dashboard': {
    get: { controller: 'dashboardController', method: 'getDashboardData' },
  },
};
