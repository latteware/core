const Entity = require('models/Entity')

module.exports = {
  method: 'get',
  path: '/:uuid',
  handler: function * () {
    const uuid = this.params.uuid

    const entity = yield Entity.findOne({
      uuid
    })

    if (!entity) { this.throw(404, 'Entity not found') }

    this.body = entity.originalData
  }
}
