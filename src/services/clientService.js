/**
 * Copyright (C) Mercury Squad
 */

/**
 * the client service
 *
 * @author      Mercury Squad
 * @version     1.0
 */

const joi = require('joi');
const _ = require('lodash');
const { Client } = require('../models');
const helper = require('../common/helper');

/**
 * handles create client
 * @param {Object} authUser the authenticated user
 * @param {Object} entity the entity
 * @returns {Object} the client
 */
async function createClient(authUser, entity) {
  let newEntity = _.extend(entity, {
    user: authUser.id,
  });

  newEntity = new Client(newEntity);

  await newEntity.save();

  return newEntity;
}

createClient.schema = {
  authUser: joi.object().required(),
  entity: joi
    .object()
    .keys({
      name: joi.string().required(),
      contactPerson: joi.string().required(),
      address: joi.string().required(),
      phoneNumber: joi.string().required(),
      email: joi.string().required(),
    })
    .required(),
};

/**
 * get all clients
 * @param {Object} authUser the authenticated user
 * @returns {Array} the clients
 */
async function getClientsList(authUser, criteria) {
  const filter = { user: authUser.id };

  // Keyword search
  if (criteria.keyword) {
    filter.$or = [{ name: { $regex: criteria.keyword, $options: 'i' } }];
  }

  let sortStr = `${criteria.sortOrder.toLowerCase() === 'asc' ? '' : '-'}${criteria.sortBy}`;

  if (criteria.sortBy !== '_id') {
    sortStr += ' _id';
  }

  let clients = await Client.find(filter)
    .populate(['user'])
    .sort(sortStr)
    .skip((criteria.page - 1) * criteria.perPage)
    .limit(criteria.perPage);

  return {
    total: await Client.countDocuments(filter),
    clients,
    page: criteria.page,
    perPage: criteria.perPage,
  };
}

getClientsList.schema = {
  authUser: joi.object().required(),
  criteria: joi.object().keys({
    keyword: joi.string().trim(),
    page: joi.page(),
    perPage: joi.perPage(),
    sortBy: joi.string().valid('name', 'contactPerson', 'email').default('_id'),
    sortOrder: joi.sortOrder(),
  }),
};

/**
 * handles the update client
 * @param {Object} authUser the authenticated user
 * @param {String} clientId the client id
 * @param {Object} entity the entity
 */
async function updateClient(authUser, clientId, entity) {
  const client = await helper.ensureEntityExists(
    Client,
    { _id: clientId, user: authUser.id },
    "Sorry, the client doesn't exist!"
  );
  _.assignIn(client, entity);
  await client.save();
  return client;
}

updateClient.schema = {
  authUser: joi.object().required(),
  clientId: joi.string().required(),
  entity: joi
    .object()
    .keys({
      name: joi.string(),
      contactPerson: joi.string(),
      address: joi.string(),
      phoneNumber: joi.string(),
      email: joi.string(),
    })
    .required(),
};

/**
 * handles the get client details
 * @param {Object} authUser the authenticated user
 * @param {String} clientId the client id
 */
async function getClientDetails(authUser, clientId) {
  let client = await helper.ensureEntityExists(
    Client,
    { _id: clientId, user: authUser.id },
    `The client ${clientId} does not exist.`
  );

  return client;
}

getClientDetails.schema = {
  authUser: joi.object().required(),
  clientId: joi.string().required(),
};

module.exports = {
  createClient,
  getClientsList,
  updateClient,
  getClientDetails,
};
