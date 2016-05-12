/* global describe, it, expect */

const { handleMessage } = require('../src/Client')

describe('Client', function () {
  describe('handleMessage', function () {
    it('dispatches to router', function () {
      let calls = []

      const router = {
        dispatch: (...args) => { calls.push(args) }
      }

      handleMessage.bind(null, router, 'herndle')({ type: 'message', text: 'herndle args1' })
      handleMessage.bind(null, router, 'herndle')({ type: 'message', text: '@herndle args2' })

      expect(calls.length).to.eq(2)

      expect(calls[0][1].text).to.eq('herndle args1')
      expect(calls[1][1].text).to.eq('@herndle args2')
    })
  })
})
