/* global describe, it, expect, assert, beforeEach */

const Location = require('../src/Location')
const { query } = require('../src/DB')
const { isEqual } = require('lodash')

describe('Location', function () {
  beforeEach(function (done) {
    query('TRUNCATE checkins').then(() => { done() })
  })

  describe('.set', function () {
    it('saves to the db', function (done) {
      Location.set('u1', 'Berlin').then((res) => {
        expect(res).to.eq(1)

        Location.get('u1').then((res) => {
          expect(res.user_id).to.eq('u1')
          expect(res.location).to.eq('Berlin')

          done()
        })
      })
    })
  })

  describe('.get', function () {
    it('gets latest known location', function (done) {
      Location.set('u1', 'Moscow').then(() => {
        Location.set('u1', 'Berlin').then(() => {
          Location.get('u1').then((res) => {
            expect(res.location).to.eq('Berlin')
            done()
          })
        })
      })
    })
  })

  describe('.all', function () {
    it('gets all latest known locations', function (done) {
      Location.set('u1', 'NOT ME').then(() => {
        Promise.all([
          Location.set('u1', 'Rip'),
          Location.set('u2', 'Rap'),
          Location.set('u3', 'Rup')
        ]).then(() => {
          Location.all().then((res) => {
            assert(isEqual(res.map((c) => c.location), ['Rip', 'Rap', 'Rup']))

            done()
          })
        })
      })
    })
  })
})
