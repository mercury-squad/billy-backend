/**
 * Copyright (C) Mercury Squad
 */

/**
 * Invoice Controller
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const InvoiceService = require('../services/invoiceService');

/**
 * handles the create
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function create(req, res) {
  res.json(await InvoiceService.create(req.user, req.body));
}

/**
 * get all invoice
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function search(req, res) {
  res.json(await InvoiceService.search(req.query));
}

/**
 * get invoice by id
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function get(req, res) {
  res.json(await InvoiceService.get(req.params.id));
}

/**
 * remove invoice by id
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function remove(req, res) {
  res.json(await InvoiceService.remove(req.params.id));
}

/**
 * update invoice
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function update(req, res) {
  res.json(await InvoiceService.update(req.params.id, req.body));
}

module.exports = {
  create,
  search,
  get,
  remove,
  update,
};
