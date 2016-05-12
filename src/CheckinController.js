const log = process.env.NODE_ENV === 'development'
  ? require('debug')('dr:checkin') : () => {}

const Controller = require('./Controller')
const Location = require('./Location')
const { first, last } = require('lodash')

class CheckinController extends Controller {
  call (args, data) {
    log(args)

    args = args.trim()

    if (args === '') {
      console.log('EMPTY')
    } else if (args.match(/<@(.*)>$/)) {
      return getLocation.bind(this)(args, data)
    } else {
      return setLocation.bind(this)(args, data)
    }
  }
}

function setLocation (args, data) {
  args = args.split(' ')

  let id, location, msg, user

  if (args.length === 1) {
    // One arg means set for me
    user = this.rtm.dataStore.getUserById(data.user)
    id = user.id
    location = args[0]
    msg = `ok _${user.name}_ you are in _${location}_`
  } else {
    // Several args means set for other guy
    id = first(args).match(/<@(.*)>/)[1]
    user = this.rtm.dataStore.getUserById(id)
    location = last(args)
    msg = `OK, ${user.name} is now in _${location}`
  }

  return Location.set(id, location).then((res) => {
    return new Promise((resolve, reject) => {
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
