/**
 * Copyright (C) Mercury Squad
 */

/**
 * the security service
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const joi = require('joi');
const errors = require('common-errors');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const util = require('util');
const _ = require('lodash');
const config = require('config');
const models = require('../models');
const helper = require('../common/helper');
const UtilityService = require('../services/utilityService');

/**
 * checks user authentication using email and password
 * @param {Object} entity the entity
 * @returns {Object} the user information with token
 */
async function login(entity) {
  const email = entity.email.toLowerCase();
  let user = await helper.ensureEntityExists(
    models.User,
    { email },
    `Sorry, we could not find any user with the email address ${email} registered with us.`
  );

  const matched = await helper.validateHash(entity.password, user.passwordHash);

  if (!matched) {
    throw new errors.NotPermittedError('Wrong email or password.');
  }

  helper.ensureUserVerified(user);

  // generate JWT token
  const token = jwt.sign(_.pick(user, ['id', 'email']), config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRATION,
  });

  user.accessToken = token;

  await user.save();

  return {
    user,
    accessToken: token,
  };
}

login.schema = {
  entity: joi
    .object()
    .keys({
      email: joi.string().required(),
      password: joi.string().required(),
    })
    .required(),
};

/**
 * does sign up process
 * @param {Object} entity the request body entity
 * @returns {Object} the sign user information
 */
async function signUp(entity) {
  const email = entity.email.toLowerCase();
  let user = await getUserByEmail(email);
  if (user) {
    throw new errors.HttpStatusError(httpStatus.CONFLICT, `email ${email} already exists`);
  }
  const verificationToken = helper.getRandomString(25);
  const passwordHash = await helper.hashString(entity.password);

  user = _.extend(entity, {
    email,
    passwordHash,
    verificationToken,
    firstName: entity.firstName,
    lastName: entity.lastName,
    verified: false,
  });

  user = new models.User(user);
  await user.save();

  // send an email
  try {
    await sendVerificationEmail(user.email, verificationToken, helper.getFrontendUrl());
  } catch (ex) {
    await user.remove();
    throw ex;
  }

  return user;
}

signUp.schema = {
  entity: joi
    .object()
    .keys({
      email: joi.string().email().required(),
      firstName: joi
        .string()
        .regex(/^([a-zA-Z, .'-]){3,30}$/i)
        .required(),
      lastName: joi
        .string()
        .regex(/^([a-zA-Z, .'-]){3,30}$/i)
        .required(),
      password: joi
        .string()
        .regex(/^\w{5,15}$/)
        .required(),
    })
    .required(),
};

/**
 * handles the confirm email
 * @param {Object} entity the request query
 * @returns {String} the success or failure
 */
async function confirmEmail(entity) {
  const user = await getUserByEmail(entity.email);

  if (!user) {
    throw new errors.NotFoundError(`User is not found with email ${entity.email}`);
  }

  if (user.verified) {
    throw new errors.HttpStatusError(httpStatus.BAD_REQUEST, `User with email ${entity.email} already verified.`);
  }

  if (user.verificationToken === entity.verificationToken) {
    user.verified = true;
    user.verificationToken = null;
    await user.save();
  } else {
    throw new errors.ValidationError("The verification code doesn't match");
  }

  return { message: `${entity.email} has been verified successfully` };
}

confirmEmail.schema = {
  entity: joi.object().keys({
    email: joi.string().email().required(),
    verificationToken: joi.string().required(),
  }),
};

/**
 * does forgot password process
 * @param {Object} entity the request body entity
 * @returns {Object} the user information
 */
async function forgotPassword(entity) {
  const user = await helper.ensureEntityExists(
    models.User,
    { email: entity.email },
    `${entity.email} could not be found`
  );

  // generate token
  const verificationToken = jwt.sign(_.pick(user, ['id']), config.JWT_SECRET, {
    expiresIn: 5000,
  });

  // update user information in database
  user.forgotPasswordToken = verificationToken;
  await user.save();

  // send an email
  try {
    await sendForgotPasswordEmail(user.email, verificationToken, helper.getFrontendUrl());
  } catch (ex) {
    throw ex;
  }

  return 'Please check your email for further processing.';
}

forgotPassword.schema = {
  entity: joi
    .object()
    .keys({
      email: joi.string().email().required(),
    })
    .required(),
};

/**
 * handles the reset password
 * @param {Object} entity the request body
 * @returns {String} the success or failure
 */
async function resetPassword(entity) {
  const user = await getUserByEmail(entity.email);

  if (!user) {
    throw new errors.NotFoundError(`${entity.email} not found`);
  }

  if (jwt.verify(entity.verificationToken, config.JWT_SECRET)) {
    const passwordHash = await helper.hashString(entity.newPassword);
    user.passwordHash = passwordHash;
    user.forgotPasswordToken = null;
    await user.save();
  } else {
    throw new errors.AuthenticationRequiredError('Verification token is not valid');
  }

  return { message: 'Your password has been set successfully, please log in to continue!' };
}

resetPassword.schema = {
  entity: joi
    .object()
    .keys({
      newPassword: joi
        .string()
        .regex(/^\w{5,15}$/)
        .required(),
      email: joi.string().required(),
      verificationToken: joi.string().required(),
    })
    .required(),
};

/**
 * handles logout
 * @param {Object} userId the user id
 */
async function logout(userId) {
  const user = await helper.ensureEntityExists(models.User, { _id: userId });

  if (!user.accessToken) {
    throw new errors.NotPermittedError(`user ${userId} is already logged out`);
  }

  user.accessToken = null;
  await user.save();
}

logout.schema = {
  userId: joi.string().required(),
};

/* ***************************** helpers ***************************** */

/**
 * gets user by email id
 * @param {String} email the email id
 * @returns {Object} the user information
 */
async function getUserByEmail(email) {
  const user = await models.User.findOne({ email });
  return user;
}

/**
 * send a verification email to user
 * @param {String} email the email id
 * @param {String} verificationToken the verification token
 * @param {String} hostUrl the host url
 */
async function sendVerificationEmail(email, verificationToken, frontendUrl) {
  const emailContent = util.format(
    config.emailVerificationContent,
    email,
    `${frontendUrl}/confirmEmail?verificationToken=${verificationToken}&email=${email}`
  );
  const emailEntity = {
    subject: 'Verify Email Address on Billy',
    to: email,
    html: emailContent,
  };
  await UtilityService.sendEmail(emailEntity);
}

/**
 * send a verification email to user
 * @param {String} email the email id
 * @param {String} verificationToken the verification token
 * @param {String} hostUrl the host url
 */
async function sendForgotPasswordEmail(email, verificationToken, frontendUrl) {
  const emailContent = util.format(
    config.forgotPasswordContent,
    email,
    `${frontendUrl}/resetPassword?verificationToken=${verificationToken}&email=${email}`
  );
  const emailEntity = {
    subject: 'Forgot Password',
    to: email,
    html: emailContent,
  };
  await UtilityService.sendEmail(emailEntity);
}

module.exports = {
  login,
  signUp,
  logout,
  confirmEmail,
  forgotPassword,
  resetPassword,
};
