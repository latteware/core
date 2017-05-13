require('co-mocha')
require('co-supertest')

const { expect } = require('chai')
const http = require('http')
const request = require('supertest')
const { clearDatabase, createWriter, createEntity } = require('../utils')
const WebHook = require('models/WebHook')
const api = require('api/')

describe('/webhook', () => {
  const agent = request.agent(http.createServer(api.callback()))

  var webhookUrl = 'http://requestb.in/1bi0qeu1'
  var writer
  var entity
  before(function * () {
    yield clearDatabase()
    writer = yield createWriter()
    entity = yield createEntity()
  })

  describe('post', (done) => {
    it('should return a new webhook', function * () {
      const { body } = yield agent.post(`/api/webhook/`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)
      .send({url: webhookUrl, entity: entity.uuid})

      expect(body.uuid.length).equal(36)
      expect(body.url).equal('http://requestb.in/1bi0qeu1')
    })
  })

  describe('delete', (done) => {
    it('should delete a webhook', function * () {
      const webhook = yield WebHook.create({
        createdBy: writer.uuid,
        entity: entity.uuid,
        url: webhookUrl
      })

      const { body } = yield agent.delete(`/api/webhook/${webhook.uuid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)

      expect(body.success).equal(true)
    })
  })
})
