const Action = require('models/Action')

module.exports = function * createAction (writer, data) {
  return yield Action.create({
    createdBy: writer.uuid,
    entity: this.uuid,
    data
  })
}
