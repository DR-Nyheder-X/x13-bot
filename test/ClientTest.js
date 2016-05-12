/* global describe, it, expect */

const { handleMessage } = require('../src/Client')

describe('Client', function () {
  describe('handleMessage', function () {
    it('dispatches to router', function () {
      let calls = []

      const router = {
        dispatch: (...args) => { calls.push(args) }
      }

      const msg = {
        type: 'message',
        text: 'herndle args'
      }

      handleMessage.bind(null, router, 'herndle')(msg)

      expect(calls[0][0]).to.eq('args')
      expect(calls[0][1]).to.eq(msg)
    })
  })
})
