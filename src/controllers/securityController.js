/**
 * Copyright (C) Mercury Squad
 */

/**
 * Security Controller
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const securityService = require('../services/securityService');

/**
 * user login with email password
 * @param req the http request
 * @param res the http response
 */
async function login(req, res) {
  res.json(await securityService.login(req.body));
}

/**
 * does sign up process
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function signUp(req, res) {
  res.json(await securityService.signUp(req.body));
}

/**
 * handles the confirm email
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function confirmEmail(req, res) {
  res.json(await securityService.confirmEmail(req.body));
}

/**
 * does forgot password process
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function forgotPassword(req, res) {
  res.json(await securityService.forgotPassword(req.body));
}

/**
 * does reset password process
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function resetPassword(req, res) {
  res.json(await securityService.resetPassword(req.body));
}

/**
 * handles logout
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function logout(req, res) {
  res.json(await securityService.logout(req.user.id));
}

module.exports = {
  login,
  signUp,
  forgotPassword,
  resetPassword,
  confirmEmail,
  logout,
};
