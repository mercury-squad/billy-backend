/**
 * Copyright (C) Mercury Squad
 */

/**
 * the invoice service
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const joi = require('joi');
const _ = require('lodash');
const { Invoice } = require('../models');
const helper = require('../common/helper');
const { InvoiceStatus } = require('../constants');

/**
 * handles create invoice
 * @param {Object} entity the entity
 * @returns {Object} the invoice
 */
async function create(entity) {
  let newEntity = _.extend(entity, {}); //add anything extra to the incoming body

  // check if any invoice with invoice number already exists may be?
  // await helper.ensureValueIsUnique(Invoice, { invoiceNumber: entity.invoiceNumber }, entity.invoiceNumber);

  newEntity = new Invoice(newEntity);

  await newEntity.save();

  return newEntity;
}

create.schema = {
  entity: joi
    .object()
    // have to enable the keys here
    // .keys({
    // status: joi.string().required().valid([InvoiceStatus.draft, InvoiceStatus.scheduled, InvoiceStatus.sent]),
    // have to add other validations here
    // })
    .required(),
};

/**
 * get all invoices
 * @returns {Array} the invoice
 */
async function search() {
  let invoices = await Invoice.find({});
  // invoices = _.map(invoices, _.partialRight(_.omit, '__v'));

  return _.orderBy(invoices, ['name'], ['asc']);
}

search.schema = {};

/**
 * get invoice by id
 * @param {String} id the invoice id
 * @returns {Object} the the invoice
 */
async function get(id) {
  const invoice = await helper.ensureEntityExists(Invoice, { _id: id }, `The invoice ${id} does not exist.`);

  return _.omit(invoice.toObject(), 'createdAt', '__v');
}

get.schema = {
  id: joi.string().required(),
};

/**
 * remove invoice by id
 * @param {String} id the invoice id
 */
async function remove(id) {
  await helper.ensureEntityExists(Invoice, { _id: id }, `The invoice ${id} does not exist.`);

  await Invoice.deleteOne({ _id: id });
}

remove.schema = {
  id: joi.string().required(),
};

/**
 * @param {String} id the invoice id
 * @param {Object} entity the invoice
 * @returns {Object} the updated entity
 */
async function update(id, entity) {
  const invoice = await helper.ensureEntityExists(Invoice, { _id: id }, `The invoice ${id} does not exist.`);

  // if (entity.invoiceNumber !== null && entity.invoiceNumber !== '') {
  //   await helper.ensureValueIsUnique(
  //     Invoice,
  //     { invoiceNumber: entity.invoiceNumber },
  //     entity.invoiceNumber
  //   );
  // }

  _.assignIn(invoice, entity);

  await invoice.save();

  return invoice;
}

update.schema = {
  id: joi.string().required(),
  entity: joi
    .object()
    // have to enable the keys here
    // .keys({})
    .required(),
};

module.exports = {
  create,
  search,
  get,
  remove,
  update,
};
