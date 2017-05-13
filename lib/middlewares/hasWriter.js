const { Writer } = require('models')

module.exports = function * hasWriter (next) {
  if (!this.req.headers.authorization) {
    this.throw(403, 'No authorization send')
  }

  const [ method, credentials ] = this.req.headers.authorization.split(' ')

  if (!method && method !== 'Bearer') {
    this.throw(403, 'Incorrect method')
  }

  const [ uuid, token ] = credentials.split(':')

  const writer = yield Writer.findOne({
    uuid, token
  })

  if (!writer) {
    this.throw(403, 'Invalid writer')
  }

  this.state.writer = writer

  yield next
}
