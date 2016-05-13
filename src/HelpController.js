const Controller = require('./Controller')
const { values } = require('lodash')

class HelpController extends Controller {
  call (args, data) {
    const texts = values(this.router.routes).map((ctrl) => ctrl.helpText).filter((t) => !!t)

    return new Promise((resolve, reject) => {
      this.rtm.sendMessage(texts.join("\n"), data.channel, (err) => {
        if (err) { return reject(err) }
        resolve()
      })
    })
  }
}

module.exports = HelpController
