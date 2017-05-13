const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { extend } = require('lodash')
const { v4 } = require('uuid')
const statics = require('./statics')
const methods = require('./methods')

const webHookSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  entity: { type: String, required: true },
  url: {type: String, require: true},
  uuid: { type: String, default: v4 }
})

extend(webHookSchema.statics, statics)
extend(webHookSchema.methods, methods)

module.exports = mongoose.model('WebHook', webHookSchema)
