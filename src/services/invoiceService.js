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
const errors = require('http-errors');
const logger = require('../common/logger');
const config = require('config');
const { Invoice, Project } = require('../models');
const helper = require('../common/helper');
const { InvoiceStatus, PaymentStatus, InvoiceSendOptions } = require('../constants');
const { generateHTMLForInvoice, convertToHTML } = require('./utilityService');

/**
 * handles create invoice
 * @param {Object} authUser the authenticated user
 * @param {Object} entity the entity
 * @returns {Object} the invoice
 */
async function createInvoice(authUser, entity, type) {
  let totalAmount = 0;
  let projectName = '';
  let newInvoiceNumber = `${config.INVOICE_NUMBER_PREFIX}00000`;

  try {
    // getting the invoice number
    const latestInvoice = await Invoice.findOne().sort({ createdAt: -1 });

    if (latestInvoice) {
      newInvoiceNumber =
        config.INVOICE_NUMBER_PREFIX +
        (+latestInvoice.invoiceNumber.split(config.INVOICE_NUMBER_PREFIX)[1] + 1).toString().padStart(5, '0');
    }

    if (entity.items && entity.items.length > 0) {
      entity.items.forEach((item) => (totalAmount += item.amount));
    }

    if (entity.expenses && entity.expenses.length > 0) {
      entity.expenses.forEach((expense) => (totalAmount += expense.amount));
    }

    // getting the project name
    const projectDocument = await Project.findOne({ _id: entity.project });

    if (projectDocument) {
      projectName = projectDocument.name;
    }

    let newEntity = _.extend(entity, {
      user: authUser.id,
      invoiceNumber: newInvoiceNumber,
      totalAmount,
      projectName,
    });

    if (type === InvoiceSendOptions.sent) {
      newEntity.status = InvoiceStatus.scheduled;
    }

    newEntity = new Invoice(newEntity);

    await newEntity.save();

    if (type === InvoiceSendOptions.preview) {
      const HTMLContent = await generateHTMLForInvoice(newEntity._id);

      return {
        document: newEntity,
        HTMLContent,
      };
    }

    return {
      document: newEntity,
    };
  } catch (error) {
    throw new errors.InternalServerError(error.message);
  }
}

createInvoice.schema = {
  authUser: joi.object().required(),
  entity: joi
    .object()
    .keys({
      status: joi
        .string()
        .required()
        .valid([InvoiceStatus.draft, InvoiceStatus.scheduled, InvoiceStatus.sent])
        .default(InvoiceStatus.draft),
      generatedDate: joi.date().allow(null),
      project: joi.id().required(),
      items: joi
        .array()
        .items(
          joi.object().keys({
            description: joi.string().required(),
            quantity: joi.number().required(),
            price: joi.number().required(),
            amount: joi.number().required(),
          })
        )
        .required(),
      expenses: joi.array().items(
        joi.object().keys({
          description: joi.string().required(),
          quantity: joi.number().required(),
          amount: joi.number().required(),
        })
      ),
      totalAmount: joi.number().required().default(0),
      paymentDueDate: joi.date().required(),
      paymentDate: joi.date().optional().allow(null),
      paymentStatus: joi
        .string()
        .valid([PaymentStatus.paid, PaymentStatus.pending, PaymentStatus.overdue])
        .default(PaymentStatus.pending),
      paymentType: joi
        .object()
        .keys({
          name: joi.string().required(),
          details: joi.string().required(),
        })
        .required(),
      notes: joi.string().allow(''),
    })
    .required(),
  type: joi.string().valid([InvoiceSendOptions.draft, InvoiceSendOptions.preview, InvoiceSendOptions.sent]),
};

/**
 * get all invoices based on the filters
 * @param {Object} authUser the authenticated user
 * @returns {Array} the invoices
 */
async function searchInvoices(authUser, criteria) {
  const filter = { user: authUser.id };

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
    .populate({
      path: 'project',
      model: 'Project',
      populate: {
        path: 'client',
        model: 'Client',
      },
    })
    .skip((criteria.page - 1) * criteria.perPage)
    .limit(criteria.perPage);

  return {
    total: await Invoice.countDocuments(filter),
    results,
    page: criteria.page,
    perPage: criteria.perPage,
  };
}

searchInvoices.schema = {
  authUser: joi.object().required(),
  criteria: joi.object().keys({
    keyword: joi.string().trim(),
    page: joi.page(),
    perPage: joi.perPage(),
    sortBy: joi.string().valid('name', 'status', 'paymentStatus', 'createdAt').default('_id'),
    sortOrder: joi.sortOrder(),
  }),
};

/**
 * get invoice by id
 * @param {Object} authUser the authenticated user
 * @param {String} id the invoice id
 * @returns {Object} the the invoice
 */
async function getInvoiceById(authUser, id) {
  await helper.ensureEntityExists(Invoice, { _id: id, user: authUser.id }, `The invoice ${id} does not exist.`);

  const invoice = await Invoice.findOne({ _id: id })
    .populate(['user'])
    .populate({
      path: 'project',
      model: 'Project',
      populate: {
        path: 'client',
        model: 'Client',
      },
    });

  const HTMLContent = convertToHTML(invoice);

  return { document: invoice.toObject(), HTMLContent };
}

getInvoiceById.schema = {
  authUser: joi.object().required(),
  id: joi.string().required(),
};

/**
 * remove invoice by id
 * @param {Object} authUser the authenticated user
 * @param {String} id the invoice id
 */
async function deleteById(authUser, entity) {
  await Invoice.deleteMany({ _id: { $in: entity.ids }, user: authUser.id });
}

deleteById.schema = {
  authUser: joi.object().required(),
  entity: joi
    .object()
    .keys({ ids: joi.array().items(joi.optionalId()).required() })
    .required(),
};

/**
 * @param {Object} authUser the authenticated user
 * @param {String} id the invoice id
 * @param {Object} entity the invoice
 * @returns {Object} the updated entity
 */
async function updateInvoiceByid(authUser, id, entity) {
  const invoice = await helper.ensureEntityExists(
    Invoice,
    { _id: id, user: authUser.id },
    `The invoice ${id} does not exist.`
  );

  _.assignIn(invoice, entity);

  await invoice.save();

  return invoice;
}

updateInvoiceByid.schema = {
  authUser: joi.object().required(),
  id: joi.string().required(),
  entity: joi
    .object()
    .keys({
      status: joi.string().valid([InvoiceStatus.draft, InvoiceStatus.scheduled, InvoiceStatus.sent]),
      generatedDate: joi.date().allow(null),
      project: joi.optionalId(),
      items: joi.array().items(
        joi.object().keys({
          description: joi.string().required(),
          quantity: joi.number().required(),
          price: joi.number().required(),
          amount: joi.number().required(),
        })
      ),
      expenses: joi.array().items(
        joi.object().keys({
          description: joi.string().required(),
          quantity: joi.number().required(),
          amount: joi.number().required(),
        })
      ),
      totalAmount: joi.number(),
      paymentDueDate: joi.date().allow(null),
      paymentDate: joi.date().optional().allow(null),
      paymentStatus: joi.string(),
      paymentType: joi
        .object()
        .keys({
          name: joi.string().required(),
          details: joi.string().required(),
        }),
      notes: joi.string().allow(''),
    })
    .required(),
};

/**
 * checks the invoices for paymentDueDate and if it exceeds today, then change the status to overdue
 */
async function checkPaymentDueDateAndUpdate() {
  try {
    let invoices = await Invoice.find({
      //query today up to this time
      paymentDueDate: {
        $lte: new Date(),
      },

      paymentStatus: PaymentStatus.pending,
    }).limit(config.CONCURRENT_INVOICE_TO_SEND);

    logger.info(`******* Found ${invoices.length} document/documents for paymentDueDate check *******`);

    // change the status to overdue
    invoices.forEach(async (invoice) => {
      _.assignIn(invoice, { paymentStatus: PaymentStatus.overdue });
      await invoice.save();
    });

    return invoices.length;
  } catch (error) {
    logger.error(`******* Error while looking for invoices *******`);
  }
}

module.exports = {
  createInvoice,
  searchInvoices,
  getInvoiceById,
  deleteById,
  updateInvoiceByid,
  checkPaymentDueDateAndUpdate,
};
