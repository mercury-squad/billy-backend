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
 * @param {Object} authUser the authenticated user
 * @param {Object} entity the entity
 * @returns {Object} the invoice
 */
async function create(authUser, entity) {
  let newEntity = _.extend(entity, {
    user: authUser.id,
  }); //add anything extra to the incoming body

  // check if any invoice with invoice number already exists may be?
  // await helper.ensureValueIsUnique(Invoice, { invoiceNumber: entity.invoiceNumber }, entity.invoiceNumber);

  newEntity = new Invoice(newEntity);

  await newEntity.save();

  return newEntity;
}

create.schema = {
  authUser: joi.object().required(),
  entity: joi
    .object()
    // .keys({
    // status: joi.string().required().valid([InvoiceStatus.draft, InvoiceStatus.scheduled, InvoiceStatus.sent]),
    // have to add other validations here
    // })
    .required(),
};

/**
 * get all invoices based on the filters
 * @returns {Array} the invoices
 */
async function search(criteria) {
  const filter = {};

  // Keyword search
  if (criteria.keyword) {
    filter.$or = [
      { projectName: { $regex: criteria.keyword, $options: 'i' } },
      { invoiceNumber: { $regex: criteria.keyword, $options: 'i' } },
    ];
  }

  // for sorting, add second sorting by _id if sortBy is not id, so that result order is determined
  if (criteria.sortBy === 'id') {
    criteria.sortBy = '_id';
  }

  let sortStr = `${criteria.sortOrder.toLowerCase() === 'asc' ? '' : '-'}${criteria.sortBy}`;

  if (criteria.sortBy !== '_id') {
    sortStr += ' _id';
  }

  const results = await Invoice.find(filter)
    .sort(sortStr)
    .populate(['user'])
    .skip((criteria.page - 1) * criteria.perPage)
    .limit(criteria.perPage);

  return {
    total: await Invoice.countDocuments(filter),
    results,
    page: criteria.page,
    perPage: criteria.perPage,
  };
}

search.schema = {
  criteria: joi.object().keys({
    keyword: joi.string().trim(),
    page: joi.page(),
    perPage: joi.perPage(),
    sortBy: joi.string().valid('name', 'status', 'paymentStatus').default('externalId'),
    sortOrder: joi.sortOrder(),
  }),
};

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
  entity: joi.object().keys({}).required(),
};

module.exports = {
  create,
  search,
  get,
  remove,
  update,
};
