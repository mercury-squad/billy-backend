/**
 * Copyright (C) Mercury Squad
 */

/**
 * User Controller
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const UserService = require('../services/userService');

/**
 * handles the change password
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function changePassword(req, res) {
  res.json(await UserService.changePassword(req.user.id, req.body));
}

/**
 * handles the update profile
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function updateProfile(req, res) {
  res.json(await UserService.updateProfile(req.user.id, req.body));
}

/**
 * handles `get` user profile
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function userProfile(req, res) {
  res.json(await UserService.userProfile(req.user.id));
}

module.exports = {
  changePassword,
  updateProfile,
  userProfile,
};
