const Writer = require('models/Writer')

module.exports = function * createWriter (opts = {}) {
  return Writer.create({})
}
