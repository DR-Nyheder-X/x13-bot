/* global describe, it, expect */

const Router = require('../src/Router')
const Controller = require('../src/Controller')

const rtm = {rtm: true}
class Ctrl extends Controller {
  constructor (rtm) {
    super(rtm)
    this.calls = []
  }
  call (cmd, data) {
    this.calls.push({cmd, data})
  }
}

describe('Router', function () {
  describe('constructor', function () {
    it('takes a map of routes', function () {
      const router = new Router(rtm, {
        checkin: Ctrl
      })

      expect(router.routes.checkin).to.be.instanceOf(Controller)
      expect(router.routes.checkin.rtm).to.equal(rtm)
    })
  })

  describe('#dispatch', function () {
    it('dispatches to actions', function () {
      const router = new Router(rtm, {
        checkin: Ctrl
      })

      router.dispatch('checkin 10', { a: 1 })

      const calls = router.routes.checkin.calls
      expect(calls[0].cmd).to.equal('10')
      expect(calls[0].data.a).to.equal(1)
    })
  })
})
