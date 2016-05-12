const log = process.env.NODE_ENV === 'development'
  ? require('debug')('dr:checkin') : () => {}

const Controller = require('./Controller')
const Location = require('./Location')

class CheckinController extends Controller {
  call (args, data) {
    log(args)
    if (args === '') {
      console.log('EMPTY')
    } else if (args.match(/<@(.*)>/)) {
      return getLocation.bind(this)(args, data)
    } else {
      return setLocation.bind(this)(args, data)
    }
  }
}

function setLocation (args, data) {
  const user = this.rtm.dataStore.getUserById(data.user)

  return Location.set(data.user, args).then((res) => {
    return new Promise((resolve, reject) => {
      const msg = `ok _${user.name}_ you are in _${args}_`
      this.rtm.sendMessage(msg, data.channel, (err) => {
        if (err) { return reject(err) }
        resolve()
      })
    })
  })
}

function getLocation (args, data) {
  const id = args.match(/<@(.*)>/)[1]
  const user = this.rtm.dataStore.getUserById(id)

  return Location.get(user.id).then((res) => {
    let msg
    if (res) {
      msg = `as far as I know, ${args} is in ${res.location}`
    } else {
      msg = `I haven't been told where ${args} is.`
    }

    return new Promise((resolve, reject) => {
      this.rtm.sendMessage(msg, data.channel, (err) => {
        if (err) { return reject(err) }
        resolve()
      })
    })
  })
}

module.exports = CheckinController
