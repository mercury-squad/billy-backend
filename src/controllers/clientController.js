/**
 * Copyright (C) Mercury Squad
 */

/**
 * Client Controller
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const clientService = require('../services/clientService');

/**
 * handles `get` clients list
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function getClientsList(req, res) {
  res.json(await clientService.getClientsList(req.user, req.query));
}

/**
 * handles `get` client details
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function getClientDetails(req, res) {
  res.json(await clientService.getClientDetails(req.user, req.params.id));
}

/**
 * handles the create client
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function createClient(req, res) {
  res.json(await clientService.createClient(req.user, req.body));
}

/**
 * handles the update client
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function updateClient(req, res) {
  res.json(await clientService.updateClient(req.user, req.params.id, req.body));
}

module.exports = {
  getClientsList,
  getClientDetails,
  createClient,
  updateClient,
};
