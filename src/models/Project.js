/**
 * Copyright (C) Mercury Squad
 */

const { ProjectStatus } = require('../constants');

/**
 * the Project schema
 * @author      Mercury Squad
 * @version     1.0
 */

const Schema = require('mongoose').Schema;

const ProjectSchema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    description: { type: String },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    clientName: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: Date },
    endDate: { type: String },
    status: { type: String, enum: [ProjectStatus.open, ProjectStatus.closed] },
    rate: { type: Number },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Keep only necessary details for GET requests
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = {
  ProjectSchema,
};
