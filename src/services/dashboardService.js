/**
 * Copyright (C) Mercury Squad
 */

/**
 * the dashboard service
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const joi = require('joi');
const _ = require('lodash');
const errors = require('http-errors');
const dayjs = require('dayjs');
const { Invoice, Project } = require('../models');
const { ProjectStatus, DateFilterOption, PaymentStatus } = require('../constants');

async function getDashboardData(authUser, filterDate) {
  try {
    let totalInvoice = 0;
    let pendingInvoice = 0;
    let totalOverdue = 0;
    let totalPaymentsReceived = 0;

    const onGoingProjects = await Project.find({ user: authUser.id, status: ProjectStatus.open }).count();

    const filteredDate = dayjs().subtract(filterDate, 'month').format();

    const filteredInvoices = await Invoice.find({
      user: authUser.id,
      createdAt: { $gte: filteredDate },
    });

    filteredInvoices.forEach((invoice) => {
      totalInvoice += invoice.totalAmount;

      // if paymentStatus is in pending status, calculate that
      if (invoice.paymentStatus === PaymentStatus.pending) {
        pendingInvoice += invoice.totalAmount;
      }

      // if paymentStatus is in pending status, calculate that
      if (invoice.paymentStatus === PaymentStatus.paid) {
        totalPaymentsReceived += invoice.totalAmount;
      }

      // if paymentDueDate has crossed today's date then calculate that
      if (dayjs(new Date()).diff(invoice.paymentDueDate, 'day') > 0) {
        totalOverdue += invoice.totalAmount;
      }
    });

    return {
      onGoingProjects,
      totalInvoice,
      pendingInvoice,
      totalPaymentsReceived,
      totalOverdue,
    };
  } catch (error) {
    throw new errors.InternalServerError(error.message);
  }
}

getDashboardData.schema = {
  authUser: joi.object().required(),
  filterDate: joi
    .string()
    .valid([...DateFilterOption])
    .required(),
};

module.exports = {
  getDashboardData,
};
