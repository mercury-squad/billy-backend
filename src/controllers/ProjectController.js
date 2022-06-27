/**
 * Copyright (C) Mercury Squad
 */

/**
 * Project Controller
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const ProjectService = require('../services/ProjectService');

/**
 * handles `get` projects list
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
 async function getProjectsList(req, res) {
  res.json(await ProjectService.getProjectsList());
}

/**
 * handles `get` project details
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
 async function getProjectDetails(req, res) {
  res.json(await ProjectService.getProjectDetails(req.params.id));
}

/**
 * handles the create project
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function createProject(req, res) {
  res.json(await ProjectService.createProject(req.body));
}

/**
 * handles the update project
 * @param {Object} req the http request
 * @param {Object} res the http response
 */
async function updateProject(req, res) {
  res.json(await ProjectService.updateProject(req.params.id, req.body));
}

module.exports = {
  getProjectsList,
  getProjectDetails,
  createProject,
  updateProject
};
