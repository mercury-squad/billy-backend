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
const clientService = require('../services/clientService');
const helper = require('../common/helper');
const { ProjectStatus } = require('../constants');

/**
 * handles create project
 * @param {Object} authUser the authenticated user
 * @param {Object} entity the entity
 * @returns {Object} the project
 */
async function createProject(authUser, entity) {
  const client = await clientService.getClientDetails(authUser, entity.client);

  let newEntity = _.extend(entity, { clientName: client.name, user: authUser.id });

  newEntity = new Project(newEntity);

  await newEntity.save();

  return newEntity;
}

createProject.schema = {
  authUser: joi.object().required(),
  entity: joi
    .object()
    .keys({
      name: joi.string().required(),
      description: joi.string(),
      client: joi.id().required(),
      startDate: joi.date().required(),
      endDate: joi.date().required(),
      status: joi.string().required().valid([ProjectStatus.open, ProjectStatus.closed]).default(ProjectStatus.open),
      rate: joi.number(),
    })
    .required(),
};

/**
 * get all projects
 * @param {Object} authUser the authenticated user
 * @returns {Array} the projects
 */
async function getProjectsList(authUser, criteria) {
  const filter = { user: authUser.id };

  // Keyword search
  if (criteria.keyword) {
    filter.$or = [
      { name: { $regex: criteria.keyword, $options: 'i' } },
      { clientName: { $regex: criteria.keyword, $options: 'i' } },
    ];
  }

  let sortStr = `${criteria.sortOrder.toLowerCase() === 'asc' ? '' : '-'}${criteria.sortBy}`;

  if (criteria.sortBy !== '_id') {
    sortStr += ' _id';
  }

  let projects = await Project.find(filter)
    .populate(['client'])
    .sort(sortStr)
    .skip((criteria.page - 1) * criteria.perPage)
    .limit(criteria.perPage);

  return {
    total: await Project.countDocuments(filter),
    projects,
    page: criteria.page,
    perPage: criteria.perPage,
  };
}

getProjectsList.schema = {
  authUser: joi.object().required(),
  criteria: joi.object().keys({
    keyword: joi.string().trim(),
    page: joi.page(),
    perPage: joi.perPage(),
    sortBy: joi.string().valid('name', 'status', 'startDate').default('_id'),
    sortOrder: joi.sortOrder(),
  }),
};

/**
 * handles the update project
 * @param {Object} authUser the authenticated user
 * @param {String} projectId the project id
 * @param {Object} entity the entity
 */
async function updateProject(authUser, projectId, entity) {
  const project = await helper.ensureEntityExists(
    Project,
    { _id: projectId, user: authUser.id },
    "Sorry, the project doesn't exist!"
  );
  _.assignIn(project, entity);

  await project.save();

  return project;
}

updateProject.schema = {
  authUser: joi.object().required(),
  projectId: joi.string().required(),
  entity: joi
    .object()
    .keys({
      name: joi.string(),
      description: joi.string(),
      client: joi.optionalId(),
      startDate: joi.date(),
      endDate: joi.date(),
      status: joi.string().valid([ProjectStatus.open, ProjectStatus.closed]).default(ProjectStatus.open),
      rate: joi.number(),
    })
    .required(),
};

/**
 * handles the get project details
 * @param {Object} authUser the authenticated user
 * @param {String} projectId the project id
 */
async function getProjectDetails(authUser, projectId) {
  await helper.ensureEntityExists(
    Project,
    { _id: projectId, user: authUser.id },
    `The project ${projectId} does not exist.`
  );

  let project = await Project.findOne({ _id: projectId }).populate(['client', 'user']);

  return project;
}

getProjectDetails.schema = {
  authUser: joi.object().required(),
  projectId: joi.string().required(),
};

module.exports = {
  createProject,
  getProjectsList,
  updateProject,
  getProjectDetails,
};
