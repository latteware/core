const Joi = require('koa-joi-router').Joi
const _ = require('lodash')
const hasWriter = require('lib/middlewares/hasWriter')

module.exports = {
  method: 'put',
  path: '/',
  validate: {
    body: {
      meta: Joi.object()
    },
    type: 'json'
  },
  handler: [hasWriter, function * () {
    const { meta } = this.request.body
    const writer = this.state.writer

    writer.meta = _.merge(writer.meta, meta)
    yield writer.save()

    this.body = {
      uuid: writer.uuid,
      token: writer.token,
      meta: writer.meta
    }
  }]
}
