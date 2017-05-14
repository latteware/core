const hasWriter = require('lib/middlewares/hasWriter')

module.exports = {
  method: 'get',
  path: '/verify',
  handler: [hasWriter, function * () {
    this.body = {
      success: true
    }
  }]
}
