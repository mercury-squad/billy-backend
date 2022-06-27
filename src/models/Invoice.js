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
    invoiceNumber: { type: String, unique: true },
    status: { type: String, enum: [InvoiceStatus.draft, InvoiceStatus.scheduled, InvoiceStatus.sent] },
    generatedDate: { type: Date },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    projectName: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: { type: Array },
    totalCharge: { type: Number },
    paymentDueDate: { type: Date },
    paymentStatus: { type: String },
    paymentMethod: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Keep only necessary details for GET requests
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = {
  InvoiceSchema,
};
