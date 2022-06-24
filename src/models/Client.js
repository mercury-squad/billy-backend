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
    name: { type: String },
    contactPerson: { type: String },
    address: { type: String },
    contactNumber: { type: Number },
    email: { type: String },
  },
  { timestamps: true }
);

module.exports = {
  ClientSchema,
};
