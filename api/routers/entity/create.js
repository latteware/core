const Joi = require('koa-joi-router').Joi
const Entity = require('models/Entity')

module.exports = {
  method: 'post',
  path: '/',
  validate: {
    body: {
      data: Joi.object().required(),
      meta: Joi.object(),
      type: Joi.string().required()
    },
    type: 'json'
  },
  handler: function * () {
    const writer = this.state.writer
    const { data, type, meta } = this.request.body

    const entity = yield Entity.create({
      createdBy: writer.uuid,
      type,
      meta,
      originalData: data
    })

    this.body = {
      uuid: entity.uuid,
      meta: entity.meta,
      originalData: entity.originalData
    }
  }
}
