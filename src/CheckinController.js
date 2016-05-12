const log = process.env.NODE_ENV === 'development'
  ? require('debug')('dr:checkin') : () => {}

const Controller = require('./Controller')
const Location = require('./Location')
const { drop } = require('lodash')

class CheckinController extends Controller {
  call (args, data) {
    log(args)

    args = args.trim()

    if (args === '') {
      return getAllLocations.bind(this)(args, data)
    } else if (args === 'help') {
      return new Promise((resolve, reject) => {
        this.rtm.sendMessage(CheckinController.helpText, data.channel, (err) => {
          if (err) { return reject(err) }
          resolve()
        })
      })
    } else if (args.match(/<@(.*)>$/)) {
      return getLocation.bind(this)(args, data)
    } else {
      return setLocation.bind(this)(args, data)
    }
  }
}

CheckinController.helpText = 'Usage:\n' +
  '`bobo checkin` => all known locations\n' +
  '`bobo checkin Berlin` => check yourself into Berlin\n' +
  '`bobo checkin @handle Moscow` => check @user into Moscow'

function setLocation (args, data) {
  let id, location, msg, user
  const userMatch = args.match(/^<@(.*)>/)

  if (userMatch) {
    // First arg is user
    id = userMatch[1]
    user = this.rtm.dataStore.getUserById(id)
    location = drop(args.split(' ')).join(' ')
    msg = `OK, _@${user.name}_ is now in _${location}_`
  } else {
    // No user means me
    user = this.rtm.dataStore.getUserById(data.user)
    id = user.id
    location = args
    msg = `ok _@${user.name}_ you are in _${location}_`
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
      msg = `as far as I know, ${args} is in ${res.location}  --  ${mapURL(res.location)}`
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

function getAllLocations (args, data) {
  return Location.all().then((res) => {
    const msg = res.map((checkin) => {
      return `<@${checkin.user_id}> is in ${checkin.location}`
    }).join('\n')

    return new Promise((resolve, reject) => {
      this.rtm.sendMessage(msg, data.channel, (err) => {
        if (err) { return reject(err) }
        resolve()
      })
    })
  })
}

function mapURL (location, opts = {}) {
  opts = Object.assign({
    center: location,
    zoom: 5,
    size: '500x300',
    maptype: 'roadmap',
    key: process.env.GOOGLE_API_KEY
  }, opts)

  const queryStr = Object.keys(opts).reduce((arr, key) => {
    arr.push(`${key}=${encodeURIComponent(opts[key])}`)
    return arr
  }, []).join('&')

  return `https://maps.googleapis.com/maps/api/staticmap?${queryStr}`
}

module.exports = CheckinController
