const WebHook = require('models/WebHook')

module.exports = {
  method: 'delete',
  path: '/:uuid',
  handler: function * () {
    const uuid = this.params.uuid

    const webhook = yield WebHook.findOne({uuid})

    if (!webhook) { this.throw(404) }

    yield webhook.remove()

    this.body = {success: true}
  }
}
