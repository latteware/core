const Writer = require('models/Writer')

module.exports = {
  method: 'post',
  path: '/',
  validate: {
    body: {},
    type: 'json'
  },
  handler: function * () {
    const writer = yield Writer.create({})

    this.body = {
      uuid: writer.uuid,
      token: writer.token
    }
  }
}
