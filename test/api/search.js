require('co-mocha')
require('co-supertest')

const { expect } = require('chai')
const http = require('http')
const request = require('supertest')
const { clearDatabase, createWriter } = require('../utils')
const Entity = require('models/Entity')
const api = require('api/')

describe('/search', () => {
  const agent = request.agent(http.createServer(api.callback()))

  var entities
  var writer
  before(function * () {
    yield clearDatabase()
    writer = yield createWriter()
    entities = [
      {createdBy: writer.uuid, type: 'insurance-policy', data: {}, meta: {externalId: '45', city: 'Mexico city'}},
      {createdBy: writer.uuid, type: 'insurance-policy', data: {}, meta: {externalId: '46', city: 'Puebla'}},
      {createdBy: writer.uuid, type: 'hospital', data: {}, meta: {externalId: '33', city: 'Mexico city'}}
    ]
    yield Entity.create(entities)
  })

  describe('post', (done) => {
    it('should return all entities', function * () {
      const { body } = yield agent.post('/api/search')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)
      .send({})

      expect(body.length).equal(3)
      expect(body[0].uuid.length).equal(36)
    })
  })

  describe('post', (done) => {
    it('should search by type', function * () {
      const { body } = yield agent.post('/api/search')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)
      .send({type: 'insurance-policy'})

      expect(body.length).equal(2)
      expect(body[0].uuid.length).equal(36)
    })
  })

  describe('post', (done) => {
    it('should search by type', function * () {
      const { body } = yield agent.post('/api/search')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)
      .send({meta: {externalId: '46'}})

      expect(body.length).equal(1)
      expect(body[0].uuid.length).equal(36)
    })
  })

  describe('post', (done) => {
    it('should search by type', function * () {
      const { body } = yield agent.post('/api/search')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)
      .send({type: 'insurance-policy', meta: {city: 'Mexico city'}})

      expect(body.length).equal(1)
      expect(body[0].uuid.length).equal(36)
    })
  })
})
