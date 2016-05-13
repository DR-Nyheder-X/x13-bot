/* global describe, it, assert, expect, rtm, beforeEach */

const HelpController = require('../src/HelpController')
const Router = require('../src/Router')
const { last } = require('lodash')

describe('HelpController', function () {
  describe('call', function () {
    let ctrl, router
    beforeEach(function () {
      class A {
        constructor () { this.helpText = 'A!' }
      }
      class B {
        constructor () { this.helpText = 'B?' }
      }

      router = new Router(rtm, { a: A, b: B, help: HelpController })
      ctrl = router.routes.help
    })

    describe('with no arguments', function () {
      it('prints help from all routers', function (done) {
        ctrl.call('', { channel: 'c1' }).then(() => {
          assert(rtm.sent.length > 0)

          const msg = last(rtm.sent)[0]
          expect(msg).to.eq(`A!\nB?`)

          done()
        })
      })
    })
  })
})
