/**
 * Copyright (C) Mercury Squad
 */

/**
 * the project service
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const joi = require('joi');
const _ = require('lodash');
const { Project } = require('../models');
const helper = require('../common/helper');

/**
 * handles create project
 * @param {Object} entity the entity
 * @returns {Object} the invoice
 */
 async function createProject(entity) {
  let newEntity = _.extend(entity, {});

  newEntity = new Project(newEntity);

  await newEntity.save();

  return newEntity;
}

createProject.schema = {
  entity: joi
    .object()
    .required(),
};

/**
 * get all projects
 * @returns {Array} the projects
 */
 async function getProjectsList() {
  let projects = await Project.find({});

  return _.orderBy(projects, ['name'], ['asc']);//change the order
}

getProjectsList.schema = {};

/**
 * handles the update project
 * @param {String} projectId the project id
 * @param {Object} entity the entity
 */
async function updateProject(projectId, entity) {
  const project = await helper.ensureEntityExists(Project, { _id: projectId }, "Sorry, the project doesn't exist!");
  _.assignIn(project, entity);
  await project.save();
  return project;
}

updateProject.schema = {
  projectId: joi.string().required(),
  entity: joi
    .object()
    .keys({
      firstName: joi//change the attributes or remove them *******
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
 * handles the get project details
 * @param {String} projectId the project id
 */
async function getProjectDetails(projectId) {
  let project = await helper.ensureEntityExists(Project, { _id: projectId }, `The project ${projectId} does not exist.`);
  project = _.omit(
    project.toObject(),
    'passwordHash',//what are these props? for a filter?
    '_id',
    'verificationToken',
    'forgotPasswordToken',
    '__v',
    'accessToken'
  );
  return project;
}

getProjectDetails.schema = {
  projectId: joi.string().required(),
};

module.exports = {
  createProject,
  getProjectsList,
  updateProject,
  getProjectDetails
};
