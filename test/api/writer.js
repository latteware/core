require('co-mocha')
require('co-supertest')

const { expect } = require('chai')
const http = require('http')
const request = require('supertest')
const { clearDatabase } = require('../utils')
const api = require('api/')

describe('/writer', () => {
  const agent = request.agent(http.createServer(api.callback()))

  before(function * () {
    yield clearDatabase()
  })

  describe('post', (done) => {
    it('should return list', function * () {
      const { body } = yield agent.post('/api/writer')
      .set('Content-Type', 'application/json')

      expect(body.uuid.length).equal(36)
      expect(body.token.length).equal(36)
    })
  })
})
