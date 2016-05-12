const log = process.env.NODE_ENV === 'development'
  ? require('debug')('dr:checkin') : () => {}

const Controller = require('./Controller')

class CheckinController extends Controller {
  call (args, data) {
    const user = this.rtm.dataStore.getUserById(data.user)
    this.rtm.sendMessage(`ok _${user.name}_ you are in _${args}_`, data.channel, log)
  }
}

module.exports = CheckinController
