const hasWriter = require('lib/middlewares/hasWriter')

module.exports = {
  method: 'post',
  path: '/verify',
  handler: [hasWriter, function * () {
    this.body = {
      success: true
    }
  }]
}
