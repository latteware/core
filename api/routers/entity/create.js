const Joi = require('koa-joi-router').Joi
const Entity = require('models/Entity')

module.exports = {
  method: 'post',
  path: '/',
  validate: {
    body: {
      data: Joi.object().required()
    },
    type: 'json'
  },
  handler: function * () {
    const writer = this.state.writer
    const { data } = this.request.body

    const entity = yield Entity.create({
      createdBy: writer.uuid,
      originalData: data
    })

    this.body = {
      uuid: entity.uuid,
      originalData: entity.originalData
    }
  }
}
