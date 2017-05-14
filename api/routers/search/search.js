const Joi = require('koa-joi-router').Joi
const Entity = require('models/Entity')
const _ = require('lodash')

module.exports = {
  method: 'post',
  path: '/',
  validate: {
    body: {
      meta: Joi.object(),
      type: Joi.string()
    },
    type: 'json'
  },
  handler: function * () {
    const { type, meta } = this.request.body
    const query = {}

    if (type) { query.type = type }
    if (meta) { _.forEach(meta, (v, k) => { query[`meta.${k}`] = v }) }

    const entities = yield Entity.find(query).select('type meta createdBy -_id uuid')

    this.body = entities
  }
}
