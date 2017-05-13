const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { extend } = require('lodash')
const { v4 } = require('uuid')
const statics = require('./statics')
const methods = require('./methods')

const entitySchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },

  uuid: { type: String, default: v4 },

  originalData: Schema.Types.Mixed
})

extend(entitySchema.statics, statics)
extend(entitySchema.methods, methods)

module.exports = mongoose.model('Entity', entitySchema)
