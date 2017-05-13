const Entity = require('models/Entity')
const Writer = require('models/Writer')
const Action = require('models/Action')
const _ = require('lodash')

module.exports = {
  method: 'get',
  path: '/:uuid/writers',
  handler: function * () {
    const uuid = this.params.uuid

    const entity = yield Entity.findOne({
      uuid
    })

    if (!entity) { this.throw(404, 'Entity not found') }

    const actions = yield Action.find({entity: entity.uuid}).select('createdBy')
    const writersIds = actions.map(a => a.createdBy)
    const writers = yield Writer.find({
      uuid: {$in: writersIds}
    })

    this.body = _.sortBy(writers, w => writersIds.indexOf(w.uuid))
      .map(w => {
        return {meta: w.meta, uuid: w.uuid}
      })
  }
}
