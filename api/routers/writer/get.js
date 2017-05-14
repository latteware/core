const Writer = require('models/Writer')
const hasWriter = require('lib/middlewares/hasWriter')

module.exports = {
  method: 'get',
  path: '/:uuid',
  handler: [hasWriter, function * () {
    const uuid = this.params.uuid

    const writer = yield Writer.findOne({
      uuid
    })

    if (!writer) { this.throw(404, 'Writer not found') }

    this.body = {
      meta: writer.meta
    }
  }]
}
