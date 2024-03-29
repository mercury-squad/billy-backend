/**
 * Copyright (C) Mercury Squad
 */

/**
 * Invoice Controller
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const invoiceService = require('../services/invoiceService');

/**
 * handles the create
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function create(req, res) {
  res.json(await invoiceService.createInvoice(req.user, req.body, req.query.type));
}

/**
 * get all invoice
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function search(req, res) {
  res.json(await invoiceService.searchInvoices(req.user, req.query));
}

/**
 * get invoice by id
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function get(req, res) {
  res.json(await invoiceService.getInvoiceById(req.user, req.params.id));
}

/**
 * remove invoices by ids
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function remove(req, res) {
  res.json(await invoiceService.deleteByIds(req.user, req.body));
}

/**
 * update invoice
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function update(req, res) {
  res.json(await invoiceService.updateInvoiceByid(req.user, req.params.id, req.body));
}

module.exports = {
  create,
  search,
  get,
  remove,
  update,
};
