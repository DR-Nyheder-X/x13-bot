const Location = require('../src/Location')

describe('Location', function () {
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

    describe('.get', function () {
      it("gets latest known location", function (done) {
        Promise.all([
          Location.set('u1', 'Moscow'),
          Location.set('u1', 'Berlin')
        ]).then((results) => {
          Location.get('u1').then((res) => {
            expect(res.location).to.eq('Berlin')

            done()
          })
        })
      })
    })
  })
})
