const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { extend } = require('lodash')
const { v4 } = require('uuid')
const statics = require('./statics')
const methods = require('./methods')

const writerSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  meta: Schema.Types.Mixed,

  uuid: { type: String, default: v4 },
  token: { type: String, default: v4 }
})

extend(writerSchema.statics, statics)
extend(writerSchema.methods, methods)

module.exports = mongoose.model('Writer', writerSchema)
