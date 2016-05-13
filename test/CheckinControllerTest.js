/* global describe, it, expect, beforeEach, rtm */

const CheckinController = require('../src/CheckinController')
const Location = require('../src/Location')
const { query } = require('../src/DB')
const { last } = require('lodash')

describe('CheckinController', function () {
  describe('call', function () {
    let ctrl
    beforeEach(function (done) {
      ctrl = new CheckinController(rtm)
      query('TRUNCATE checkins').then(() => { done() })
    })

    describe('help', function () {
      it('returns help text', function (done) {
        ctrl.call('help', { channel: 'c1' }).then(() => {
          expect(last(rtm.sent)[0]).to.eq(new CheckinController().helpText)
          done()
        })
      })
    })

    describe('with no arguments', function () {
      it('returns locations of all users', function (done) {
        Promise.all([
          Location.set('u1', 'Paris'),
          Location.set('u666', 'Berlin')
        ]).then(() => {
          ctrl.call('', { channel: 'c1' }).then(() => {
            expect(last(rtm.sent)[0]).to.match(/<@u1>.*Paris/)
            expect(last(rtm.sent)[0]).to.match(/<@u666>.*Berlin/)

            done()
          })
        })
      })
    })

    describe('with a location argument', function () {
      it('saves loc and responds', function (done) {
        ctrl.call('Berlin, Germany', { user: 'u1', channel: 'c1' }).then(() => {
          expect(last(rtm.sent)[0]).to.eq('ok _@NAME_ you are in _Berlin, Germany_')

          Location.get('u1').then((res) => {
            expect(res.location).to.eq('Berlin, Germany')

            done()
          })
        })
      })
    })

    describe('with a user argument', function () {
      it('gets location when there is one', function (done) {
        Location.set('u1', 'Sao Paolo').then(() => {
          ctrl.call('<@u1>', { channel: 'c1' }).then(() => {
            expect(last(rtm.sent)[0]).to.match(/<@u1>.*Sao Paolo/)

            done()
          })
        })
      })
      it('says it doesn\'t know it', function (done) {
        ctrl.call('<@u1>', { channel: 'c1' }).then(() => {
          expect(last(rtm.sent)[0]).to.match(/haven't been told/)

          done()
        })
      })
    })

    describe('with a user and a location', function () {
      it('sets location for user', function (done) {
        ctrl.call('<@u666> Herning, Danmark', { channel: 'c1' }).then(() => {
          Location.get('u666').then((res) => {
            expect(res.location).to.eq('Herning, Danmark')
            done()
          })
        })
      })
    })
  })
})
