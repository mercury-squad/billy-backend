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
    contactPerson: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
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
