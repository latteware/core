const mongoose = require('mongoose')
const { extend } = require('lodash')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const co = require('co')
const request = require('superagent')

const statics = require('./statics')
const methods = require('./methods')
const config = require('config/server')

const actionSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  entity: { type: String, required: true },

  uuid: { type: String, default: v4 },

  data: Schema.Types.Mixed
})

extend(actionSchema.statics, statics)
extend(actionSchema.methods, methods)

actionSchema.post('save', function (doc) {
  co(function * () {
    if (config.sendWebhooks) {
      const Webhook = mongoose.model('WebHook')
      const webhooks = yield Webhook.find({entity: doc.entity})
      const webhookData = {
        data: doc.data,
        entity: doc.entity,
        createdBy: doc.createdBy,
        uuid: doc.uuid
      }

      webhooks.forEach(w => {
        request.post(w.url).send(webhookData)
      })
    }
  }).catch(function (err) {
    console.error(err.stack)
  })
})

module.exports = mongoose.model('Action', actionSchema)
