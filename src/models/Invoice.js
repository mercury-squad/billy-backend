/**
 * Copyright (C) Mercury Squad
 */

const { InvoiceStatus, PaymentStatus } = require('../constants');

/**
 * the Invoice schema
 * @author      Mercury Squad
 * @version     1.0
 */

const Schema = require('mongoose').Schema;

const InvoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, unique: true, required: true },
    status: { type: String, enum: [InvoiceStatus.draft, InvoiceStatus.scheduled, InvoiceStatus.sent] },
    generatedDate: { type: Date },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    projectName: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: {
      type: [
        {
          description: { type: String },
          quantity: { type: Number },
          price: { type: Number },
          amount: { type: Number },
        },
      ],
    },
    expenses: {
      type: [
        {
          description: { type: String },
          quantity: { type: Number },
          amount: { type: Number },
        },
      ],
    },
    totalAmount: { type: Number, default: 0 },
    paymentDueDate: { type: Date },
    paymentDate: { type: Date },
    paymentStatus: {
      type: String,
      enum: [PaymentStatus.paid, PaymentStatus.pending, PaymentStatus.overdue],
      default: PaymentStatus.pending,
    },
    paymentType: {
      type: {
        name: { type: String },
        details: { type: String },
      },
    },
    notes: { type: String },
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
