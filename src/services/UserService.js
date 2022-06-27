/**
 * Copyright (C) Mercury Squad
 */

/**
 * the user service
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const joi = require('joi');
const _ = require('lodash');
const models = require('../models');
const helper = require('../common/helper');

/**
 * handles the change password
 * @param {String} userId the user id
 * @param {Object} entity the entity
 */
async function changePassword(userId, entity) {
  const user = await helper.ensureEntityExists(models.User, { _id: userId });
  user.passwordHash = await helper.hashString(entity.newPassword);
  await user.save();
}

changePassword.schema = {
  userId: joi.string().required(),
  entity: joi
    .object()
    .keys({
      newPassword: joi
        .string()
        .regex(/^\w{5,15}$/)
        .required(),
    })
    .required(),
};

/**
 * handles the update profile
 * @param {String} userId the user id
 * @param {Object} entity the entity
 */
async function updateProfile(userId, entity) {
  const user = await helper.ensureEntityExists(models.User, { _id: userId }, "Sorry, the user doesn't exist!");
  user.firstName = entity.firstName;
  user.lastName = entity.lastName;
  await user.save();
  return user;
}

updateProfile.schema = {
  userId: joi.string().required(),
  entity: joi
    .object()
    .keys({
      firstName: joi
        .string()
        .regex(/^([a-zA-Z, .'-]){3,30}$/i)
        .required(),
      lastName: joi
        .string()
        .regex(/^([a-zA-Z, .'-]){3,30}$/i)
        .required(),
    })
    .required(),
};

/**
 * handles the get profile
 * @param {String} userId the user id
 */
async function userProfile(userId) {
  let user = await helper.ensureEntityExists(models.User, { _id: userId });
  user = _.omit(user.toObject(), 'accessToken');

  return user;
}

userProfile.schema = {
  userId: joi.string().required(),
};

module.exports = {
  changePassword,
  updateProfile,
  userProfile,
};
