const Joi = require('koa-joi-router').Joi
const WebHook = require('models/WebHook')
const Entity = require('models/Entity')

module.exports = {
  method: 'post',
  path: '/',
  validate: {
    body: {
      url: Joi.string().regex(require('lib/reWeburl'), 'reWeburl'),
      entity: Joi.string().required()
    },
    type: 'json'
  },
  handler: function * () {
    const writer = this.state.writer
    const { url, entity } = this.request.body

    const currentEntity = yield Entity.findOne({uuid: entity})

    if (!currentEntity) { this.throw(404, 'Entity not found') }

    const webHook = yield WebHook.create({
      createdBy: writer.uuid,
      entity: currentEntity.uuid,
      url
    })

    this.body = {
      uuid: webHook.uuid,
      url: webHook.url
    }
  }
}
