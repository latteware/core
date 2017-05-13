const Entity = require('models/Entity')
const Action = require('models/Action')

module.exports = {
  method: 'get',
  path: '/:uuid/action',
  handler: function * () {
    const uuid = this.params.uuid

    const entity = yield Entity.findOne({
      uuid
    })

    if (!entity) { this.throw(404, 'Entity not found') }

    const actions = yield Action.find({
      entity: entity.uuid
    })

    this.body = actions
  }
}
