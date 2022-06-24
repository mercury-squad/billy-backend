/**
 * Copyright (C) Mercury Squad
 */

/**
 * the Project schema
 * @author      Mercury Squad
 * @version     1.0
 */

const Schema = require('mongoose').Schema;

const ProjectSchema = new Schema(
  {
    name: { type: String },
    description: { type: String },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: Date },
    endDate: { type: String },
    status: { type: String, enum: ['open', 'closed'] },
    rate: { type: Number },
  },
  { timestamps: true }
);

module.exports = {
  ProjectSchema,
};
