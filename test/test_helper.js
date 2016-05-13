const chai = require('chai')
global.expect = chai.expect
global.assert = chai.assert

global.Promise = require('bluebird')

class MockRtm {
  constructor () {
    this.sent = []
    this.dataStore = {
      getUserById: (id) => ({ id: id, name: 'NAME' })
    }
  }

  sendMessage (...args) {
    this.sent.push(args)
    // call callback
    const lastArg = args[args.length - 1]
    if (typeof lastArg === 'function') { lastArg() }
  }
}

global.rtm = new MockRtm()

require('dotenv').load()
