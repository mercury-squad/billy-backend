/**
 * Copyright (C) Mercury Squad
 */

/**
 * the Client schema
 * @author      Mercury Squad
 * @version     1.0
 */

const Schema = require('mongoose').Schema;

const ClientSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    contactPerson: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
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
  ClientSchema,
};
