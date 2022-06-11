/**
 * Copyright (C) Mercury Squad
 */

/**
 * the User schema
 * @author      Mercury Squad
 * @version     1.0
 */

const Schema = require('mongoose').Schema;

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  passwordHash: { type: String },
  verificationToken: { type: String },
  accessToken: { type: String },
  verified: { type: Boolean },
  forgotPasswordToken: { type: String },
  lastLoginAt: { type: Date },
  role: { type: String },
});

module.exports = {
  UserSchema,
};
