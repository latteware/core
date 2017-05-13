require('co-mocha')
require('co-supertest')

const { expect } = require('chai')
const http = require('http')
const request = require('supertest')
const { clearDatabase, createWriter, createEntity } = require('../utils')
const Entity = require('models/Entity')
const api = require('api/')

describe('/action', () => {
  const agent = request.agent(http.createServer(api.callback()))

  var writer
  var entity
  before(function * () {
    yield clearDatabase()
    writer = yield createWriter()
    entity = yield createEntity()
  })

  describe('post', (done) => {
    it('should return list', function * () {
      const { body } = yield agent.post(`/api/entity/${entity.uuid}/action`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)
      .send({data: {name: 'Daniel Zavala'}})

      expect(body.uuid.length).equal(36)
      expect(body.data.name).equal('Daniel Zavala')
    })
  })

  describe('get', (done) => {
    it('should return list', function * () {
      const entity = yield Entity.create({
        createdBy: writer.uuid,
        originalData: {name: 'Daniel'}
      })
      yield entity.createAction(writer, {address: '42 Wallaby Way, Sydney'})
      yield entity.createAction(writer, {birthday: new Date('2003-07-04T05:00:00.000Z')})

      const { body } = yield agent.get(`/api/entity/${entity.uuid}/action`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)

      expect(body.length).equal(2)
      expect(body[0].data.address).equal('42 Wallaby Way, Sydney')
      expect(body[1].data.birthday.toString()).equal('2003-07-04T05:00:00.000Z')
    })
  })
})
