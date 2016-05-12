const CheckinController = require('../src/CheckinController')
const Location = require('../src/Location')
const { query } = require('../src/DB')
const { last } = require('lodash')

const rtm = (sent) => ({
  dataStore: {
    getUserById: (id) => ({ id: id, name: 'NAME' })
  },
  sendMessage: (...args) => {
    sent.push(args)
    const lastArg = args[args.length - 1]
    if (typeof lastArg === 'function') { lastArg() }
  }
})

describe('CheckinController', function () {
  describe('call', function () {
    let ctrl, sent
    beforeEach(function (done) {
      sent = []
      ctrl = new CheckinController(rtm(sent))
      query('TRUNCATE checkins').then(() => { done() })
    })

    describe('with a location argument', function () {
      it('saves loc and responds', function (done) {
        ctrl.call('Berlin', { user: 'u1', channel: 'c1' }).then(() => {
          expect(last(sent)[0]).to.eq('ok _NAME_ you are in _Berlin_')

          Location.get('u1').then((res) => {
            expect(res.location).to.eq('Berlin')

            done()
          })
        })
      })
    })

    describe('with a user argument', function () {
      it('gets location when there is one', function (done) {
        Location.set('u1', 'Sao Paolo').then(() => {
          ctrl.call('<@u1>', { channel: 'c1' }).then(() => {
            expect(last(sent)[0]).to.match(/<@u1>.*Sao Paolo/)

            done()
          })
        })
      })
      it('says it doesn\'t know it', function (done) {
        ctrl.call('<@u1>', { channel: 'c1' }).then(() => {
          expect(last(sent)[0]).to.match(/haven't been told/)

          done()
        })
      })
    })

    describe('with a user and a location', function () {
      it('sets location for user', function (done) {
        ctrl.call('<@u666> Herning', { channel: 'c1' }).then(() => {
          Location.get('u666').then((res) => {
            expect(res.location).to.eq('Herning')
            done()
          })
        })
      })
    })
  })
})
