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
    companyName: { type: String },
    businessLogo: { type: String },
    profileLogo: { type: String },
    website: { type: String },
    paymentOptions: { type: [{ type: String }] },
    passwordHash: { type: String },
    verificationToken: { type: String },
    accessToken: { type: String },
    verified: { type: Boolean },
    forgotPasswordToken: { type: String },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = {
  UserSchema,
};
