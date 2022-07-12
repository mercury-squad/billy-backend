/**
 * Copyright (C) Mercury Squad
 */

/**
 * Dashboard Controller
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const dashboardService = require('../services/dashboardService');

/**
 * get the dashboard
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function getDashboardData(req, res) {
  res.json(await dashboardService.getDashboardData(req.user, req.query.filterDate));
}

module.exports = {
  getDashboardData,
};
