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
    it('should return list', function * () {
      const { body } = yield agent.post('/api/entity')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)
      .send({data: {name: 'Daniel'}})

      expect(body.uuid.length).equal(36)
      expect(body.originalData.name).equal('Daniel')
    })
  })

  describe('get', (done) => {
    it('should return simple entity', function * () {
      const entity = yield Entity.create({
        createdBy: writer.uuid,
        originalData: {name: 'Daniel'}
      })

      const { body } = yield agent.get(`/api/entity/${entity.uuid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)

      expect(body.data.name).equal('Daniel')
    })
  })

  describe('get', (done) => {
    it('should return entity with name, address and birthday', function * () {
      const entity = yield Entity.create({
        createdBy: writer.uuid,
        originalData: {name: 'Daniel'}
      })
      yield entity.createAction(writer, {address: '42 Wallaby Way, Sydney'})
      yield entity.createAction(writer, {birthday: new Date('2003-07-04T05:00:00.000Z')})

      const { body } = yield agent.get(`/api/entity/${entity.uuid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)

      expect(body.data.name).equal('Daniel')
      expect(body.data.address).equal('42 Wallaby Way, Sydney')
      expect(body.data.birthday.toString()).equal('2003-07-04T05:00:00.000Z')
    })
  })

  describe('get', (done) => {
    it('should return entity from writer', function * () {
      const firstWriter = yield createWriter()
      const secondWriter = yield createWriter()
      const entity = yield Entity.create({
        createdBy: writer.uuid,
        originalData: {name: 'Daniel'}
      })
      yield entity.createAction(firstWriter, {address: '42 Wallaby Way, Sydney'})
      yield entity.createAction(secondWriter, {address: '43 Wallaby Way, Sydney'})

      const { body } = yield agent.get(`/api/entity/${entity.uuid}?writers=${firstWriter.uuid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)

      expect(body.data.name).equal('Daniel')
      expect(body.data.address).equal('42 Wallaby Way, Sydney')
    })
  })

  describe('get', (done) => {
    it('should return entity from writers', function * () {
      const firstWriter = yield createWriter()
      const secondWriter = yield createWriter()
      const thirdWriter = yield createWriter()
      const entity = yield Entity.create({
        createdBy: writer.uuid,
        originalData: {name: 'Daniel'}
      })
      yield entity.createAction(firstWriter, {address: '42 Wallaby Way, Sydney'})
      yield entity.createAction(secondWriter, {address: '43 Wallaby Way, Sydney', gender: 'male'})
      yield entity.createAction(thirdWriter, {address: '44 Wallaby Way, Sydney', gender: 'female'})

      const { body } = yield agent.get(`/api/entity/${entity.uuid}?writers=${firstWriter.uuid},${secondWriter.uuid}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${writer.uuid}:${writer.token}`)

      expect(body.data.name).equal('Daniel')
      expect(body.data.address).equal('43 Wallaby Way, Sydney')
      expect(body.data.gender).equal('male')
    })
  })
})
