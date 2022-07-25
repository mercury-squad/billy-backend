/**
 * Copyright (C) Mercury Squad
 */

/**
 * the Project Routes
 *
 * @author      Mercury Squad
 * @version     1.0
 */

module.exports = {
  '/project': {
    get: {
      controller: 'projectController',
      method: 'getProjectsList',
    },
    post: {
      controller: 'projectController',
      method: 'createProject',
    },
    delete: {
      controller: 'projectController',
      method: 'deleteProjectsByIds',
    },
  },
  '/project/:id': {
    get: {
      controller: 'projectController',
      method: 'getProjectDetails',
    },
    put: {
      controller: 'projectController',
      method: 'updateProject',
    },
  },
};
