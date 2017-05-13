const Entity = require('models/Entity')
const Action = require('models/Action')
const _ = require('lodash')

module.exports = {
  method: 'get',
  path: '/:uuid',
  handler: function * () {
    const uuid = this.params.uuid
    const writersQuerystring = this.request.query.writers
    const writers = writersQuerystring ? writersQuerystring.split(',') : null

    const entity = yield Entity.findOne({
      uuid
    })

    if (!entity) { this.throw(404, 'Entity not found') }

    const query = {
      entity: entity.uuid
    }

    if (writers) {
      query.createdBy = {$in: writers}
    }

    const actions = yield Action.find(query)

    var data = entity.originalData
    actions.forEach(a => {
      data = _.merge(data, a.data)
    })

    this.body = {
      createdBy: entity.createdBy,
      uuid: entity.uuid,
      meta: entity.meta,
      data
    }
  }
}
