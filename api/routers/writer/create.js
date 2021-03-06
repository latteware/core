const Joi = require('koa-joi-router').Joi
const Writer = require('models/Writer')

module.exports = {
  method: 'post',
  path: '/',
  validate: {
    body: {
      meta: Joi.object()
    },
    type: 'json'
  },
  handler: function * () {
    const { meta } = this.request.body
    const writer = yield Writer.create({meta})

    this.body = {
      uuid: writer.uuid,
      token: writer.token,
      meta: writer.meta
    }
  }
}
