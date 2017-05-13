const hasWriter = require('lib/middlewares/hasWriter')

module.exports = {
  routes: require('es6-requireindex')(__dirname),
  prefix: '/entity',
  middlewares: [hasWriter]
}
