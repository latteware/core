require('co-mocha')
require('co-supertest')

const { expect } = require('chai')
const http = require('http')
const request = require('supertest')
const { clearDatabase } = require('../utils')
const Writer = require('models/Writer')
const api = require('api/')

describe('/writer', () => {
  const agent = request.agent(http.createServer(api.callback()))

  before(function * () {
    yield clearDatabase()
  })

  describe('post', (done) => {
    it('should return new writer', function * () {
      const { body } = yield agent.post('/api/writer')
      .set('Content-Type', 'application/json')

      expect(body.uuid.length).equal(36)
      expect(body.token.length).equal(36)
    })
  })

  describe('post', (done) => {
    it('should return new writer with meta data', function * () {
      const { body } = yield agent.post('/api/writer')
      .set('Content-Type', 'application/json')
      .send({meta: {contact: 'siedrix@gmail.com'}})

      expect(body.uuid.length).equal(36)
      expect(body.token.length).equal(36)
      expect(body.meta.contact).equal('siedrix@gmail.com')
    })
  })

  describe('put', (done) => {
    it('should return update writer meta data', function * () {
      const writer = yield Writer.create({
        meta: {contact: 'siedrix@gmail.com'}
      })

      const { body } = yield agent.put('/api/writer')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)
      .send({meta: {name: 'Daniel Zavala'}})

      expect(body.uuid.length).equal(36)
      expect(body.token.length).equal(36)
      expect(body.meta.contact).equal('siedrix@gmail.com')
      expect(body.meta.name).equal('Daniel Zavala')
    })
  })
})
