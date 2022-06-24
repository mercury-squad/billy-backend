/**
 * Copyright (C) Mercury Squad
 */

const { InvoiceStatus } = require('../constants');

/**
 * the Invoice schema
 * @author      Mercury Squad
 * @version     1.0
 */

const Schema = require('mongoose').Schema;

const InvoiceSchema = new Schema(
  {
    status: { type: String, enum: [InvoiceStatus.draft, InvoiceStatus.scheduled, InvoiceStatus.sent] },
    genetatedDate: { type: Date },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    items: { type: Array },
    totalCharge: { type: Number },
    paymentDueDate: { type: Date },
    paymentStatus: { type: String },
    paymentMethod: { type: String },
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = {
  InvoiceSchema,
};
