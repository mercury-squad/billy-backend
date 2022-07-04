/**
 * Copyright (C) Mercury Squad
 */

/**
 * the User schema
 * @author      Mercury Squad
 * @version     1.0
 */

const Schema = require('mongoose').Schema;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String },
    phoneNumber: { type: String },
    companyName: { type: String },
    businessLogo: { type: String },
    profileLogo: { type: String },
    website: { type: String },
    paymentOptions: {
      type: [
        {
          type: {
            name: { type: String },
            details: { type: String },
          },
        },
      ],
    },
    passwordHash: { type: String },
    verificationToken: { type: String },
    accessToken: { type: String },
    verified: { type: Boolean },
    forgotPasswordToken: { type: String },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Keep only necessary details for GET requests
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.accessToken;
        delete ret.verificationToken;
        delete ret.forgotPasswordToken;
        return ret;
      },
    },
  }
);

module.exports = {
  UserSchema,
};
