const Entity = require('models/Entity')
const { entityFixture } = require('../fixtures')

module.exports = function * createEntity (opts = {}) {
  return Entity.create(Object.assign({}, entityFixture, opts))
}
