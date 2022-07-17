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
const { ProjectStatus, DateFilterOption, PaymentStatus, monthsMapping } = require('../constants');

async function getDashboardData(authUser, filterDate) {
  try {
    let totalInvoice = 0;
    let pendingInvoice = 0;
    let totalOverdue = 0;
    let totalPaymentsReceived = 0;

    const monthlyIncome = [
      {
        month: 'Jan',
        income: 0,
      },
      {
        month: 'Feb',
        income: 0,
      },
      {
        month: 'Mar',
        income: 0,
      },
      {
        month: 'Apr',
        income: 0,
      },
      {
        month: 'Jun',
        income: 0,
      },
      {
        month: 'Jul',
        income: 0,
      },
      {
        month: 'Aug',
        income: 0,
      },
      {
        month: 'Sep',
        income: 0,
      },
      {
        month: 'Oct',
        income: 0,
      },
      {
        month: 'Nov',
        income: 0,
      },
      {
        month: 'Dec',
        income: 0,
      },
    ];

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

      // if paymentStatus is in overdue status, calculate that
      if (invoice.paymentStatus === PaymentStatus.overdue) {
        totalOverdue += invoice.totalAmount;
      }

      // if paymentStatus is in paid status, calculate that
      if (invoice.paymentStatus === PaymentStatus.paid) {
        totalPaymentsReceived += invoice.totalAmount;
      }
    });

    const last12MonthsInvoices = await Invoice.find({
      user: authUser.id,
      paymentStatus: PaymentStatus.paid,
      createdAt: { $gte: dayjs().subtract(12, 'month').format() },
    });

    last12MonthsInvoices.forEach((invoice) => {
      if (invoice.paymentDate) {
        const paymentMonth = monthsMapping[dayjs(invoice.paymentDate).month()];

        const monthFound = monthlyIncome.find((item) => item.month === paymentMonth);

        if (monthFound) {
          monthFound.income += invoice.totalAmount;
        }
      }
    });

    return {
      onGoingProjects,
      totalInvoice,
      pendingInvoice,
      totalPaymentsReceived,
      totalOverdue,
      monthlyIncome,
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
