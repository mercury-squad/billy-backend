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
      controller: 'ProjectController',
      method: 'getProjectsList',
    },
    post: {
      controller: 'ProjectController',
      method: 'createProject',
    }
  },
  '/project/:id': {
    get: {
      controller: 'ProjectController',
      method: 'getProjectDetails',
    },
    put: {
      controller: 'ProjectController',
      method: 'updateProject',
    },
  }
};
