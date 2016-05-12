const CheckinController = require('../src/CheckinController')
const rtm = (sent) => ({
  dataStore: {
    getUserById: () => ({ name: 'NAME' })
  },
  sendMessage: (...args) => {
    sent.push(args)
  }
})

describe('CheckinController', function () {
  describe('call', function () {
    let ctrl, sent
    beforeEach(() => {
      sent = []
      ctrl = new CheckinController(rtm(sent))
    })
    it('responds', function () {
      ctrl.call('BERLIN', { user: 'u1', channel: 'c1' })
      expect(sent[0][0]).to.eq('ok _NAME_ you are in _BERLIN_')
    })
    it('saves loc', function () {
      ctrl.call('BERLIN', { user: 'u1', channel: 'c1' })
    })
  })
})
