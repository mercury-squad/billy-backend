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
 * @param {Object} entity the entity
 * @returns {Object} the client
 */
 async function createClient(entity) {
  let newEntity = _.extend(entity, {});

  newEntity = new Client(newEntity);

  await newEntity.save();

  return newEntity;
}

createClient.schema = {
  entity: joi
    .object()
    .required(),
};

/**
 * get all clients
 * @returns {Array} the clients
 */
 async function getClientsList() {
  let clients = await Client.find({});

  return _.orderBy(clients, ['name'], ['asc']);//change the order
}

getClientsList.schema = {};

/**
 * handles the update client
 * @param {String} clientId the client id
 * @param {Object} entity the entity
 */
async function updateClient(clientId, entity) {
  const client = await helper.ensureEntityExists(Client, { _id: clientId }, "Sorry, the client doesn't exist!");
  _.assignIn(client, entity);
  await client.save();
  return client;
}

updateClient.schema = {
  clientId: joi.string().required(),
  entity: joi
    .object()
    .required(),
};

/**
 * handles the get client details
 * @param {String} clientId the client id
 */
async function getClientDetails(clientId) {
  let client = await helper.ensureEntityExists(Client, { _id: clientId }, `The client ${clientId} does not exist.`);
  client = _.omit(
    client.toObject()
  );
  return client;
}

getClientDetails.schema = {
  clientId: joi.string().required(),
};

module.exports = {
  createClient,
  getClientsList,
  updateClient,
  getClientDetails
};
