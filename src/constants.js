/**
 * Copyright (C) Mercury Squad
 */

/**
 * the constants
 *
 * @author      Mercury Squad
 * @version     1.0
 */

/**
 * the roles
 */
const Roles = {
  admin: 'Admin',
  user: 'User',
};

/**
 * the invoice status
 */
const InvoiceStatus = {
  draft: 'draft',
  scheduled: 'scheduled',
  sent: 'sent',
};

/**
 * the invoice status
 */
const InvoiceSendOptions = {
  draft: 'draft',
  preview: 'preview',
  sent: 'sent',
};

/**
 * the invoice status
 */
const PaymentStatus = {
  pending: 'pending',
  paid: 'paid',
  overdue: 'overdue',
};

/**
 * the project status
 */
const ProjectStatus = {
  open: 'open',
  closed: 'closed',
};

/**
 * the project status
 */
const DateFilterOption = ['12', '6', '3', '1'];

// default data fetch limit
const DefaultQueryLimit = 10;

// mapping of months number and name to align with dayjs
const monthsMapping = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};

module.exports = {
  DefaultQueryLimit,
  Roles,
  InvoiceStatus,
  InvoiceSendOptions,
  PaymentStatus,
  ProjectStatus,
  DateFilterOption,
  monthsMapping,
};
