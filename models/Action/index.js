const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { extend } = require('lodash')
const { v4 } = require('uuid')
const statics = require('./statics')
const methods = require('./methods')

const actionSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  entity: { type: String, required: true },

  uuid: { type: String, default: v4 },

  data: Schema.Types.Mixed
})

extend(actionSchema.statics, statics)
extend(actionSchema.methods, methods)

module.exports = mongoose.model('Action', actionSchema)
