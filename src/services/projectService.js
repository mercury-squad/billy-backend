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
 * @returns {Object} the project
 */
 async function createProject(entity, client) {
  let newEntity = _.extend(entity, {clientName: client});

  newEntity = new Project(newEntity);

  await newEntity.save();

  return newEntity;
}

createProject.schema = {
  client: joi.required(),
  entity: joi
    .object()
    .required(),
};

/**
 * get all projects
 * @returns {Array} the projects
 */
 async function getProjectsList(criteria) {
  const filter = {};

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
  criteria: joi.object().keys({
    keyword: joi.string().trim(),
    page: joi.page(),
    perPage: joi.perPage(),
    sortBy: joi.string().valid('name', 'status').default('_id'),
    sortOrder: joi.sortOrder(),
  }),
};

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
    .required(),
};

/**
 * handles the get project details
 * @param {String} projectId the project id
 */
async function getProjectDetails(projectId) {
  await helper.ensureEntityExists(Project, { _id: projectId }, `The project ${projectId} does not exist.`);

  let project = await Project.findOne({_id: projectId})
    .populate(['client', 'user']);
    
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
