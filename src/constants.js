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
};

/**
 * the project status
 */
const ProjectStatus = {
  open: 'open',
  closed: 'closed',
};

// default data fetch limit
const DefaultQueryLimit = 10;

module.exports = {
  DefaultQueryLimit,
  Roles,
  InvoiceStatus,
  InvoiceSendOptions,
  PaymentStatus,
  ProjectStatus,
};
