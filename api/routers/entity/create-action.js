const Joi = require('koa-joi-router').Joi
const Entity = require('models/Entity')
const Action = require('models/Action')

module.exports = {
  method: 'post',
  path: '/:uuid/action',
  validate: {
    body: {
      data: Joi.object().required()
    },
    type: 'json'
  },
  handler: function * () {
    const uuid = this.params.uuid
    const writer = this.state.writer
    const { data } = this.request.body

    const entity = yield Entity.findOne({
      uuid
    })

    if (!entity) { this.throw(404, 'Entity not found') }

    const action = yield Action.create({
      createdBy: writer.uuid,
      entity: entity.uuid,
      data
    })

    this.body = {
      uuid: action.uuid,
      data: action.data
    }
  }
}
