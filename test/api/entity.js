require('co-mocha')
require('co-supertest')

const { expect } = require('chai')
const http = require('http')
const request = require('supertest')
const { clearDatabase, createWriter } = require('../utils')
const Entity = require('models/Entity')
const api = require('api/')

describe('/entity', () => {
  const agent = request.agent(http.createServer(api.callback()))

  var writer
  before(function * () {
    yield clearDatabase()
    writer = yield createWriter()
  })

  describe('post', (done) => {
    it('should retuna list', function * () {
      const { body } = yield agent.post('/api/entity')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)
      .send({data: {name: 'Daniel'}})

      expect(body.uuid.length).equal(36)
      expect(body.originalData.name).equal('Daniel')
    })
  })

  describe('get', (done) => {
    it('should retuna list', function * () {
      const entity = yield Entity.create({
        createdBy: writer.uuid,
        originalData: {name: 'Daniel'}
      })

      const { body } = yield agent.get(`/api/entity/${entity.uuid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)

      expect(body.name).equal('Daniel')
    })
  })
})
