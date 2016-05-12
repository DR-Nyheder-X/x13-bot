const log = process.env.NODE_ENV === 'development'
  ? require('debug')('dr:client') : () => {}
const {
  RtmClient, MemoryDataStore,
  CLIENT_EVENTS, RTM_EVENTS
} = require('@slack/client')

const Router = require('./Router')

const routes = {
  checkin: require('./CheckinController')
}

function start (token, handle) {
  const rtm = new RtmClient(token, {
    logLevel: 'warn',
    dataStore: new MemoryDataStore(),
    autoReconnect: true
  })

  rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function authenticated (data) {
    log('Authenticated as ' + data.self.name)
  })

  rtm.on(RTM_EVENTS.MESSAGE, handleMessage.bind(null, new Router(rtm, routes), handle))

  log('Starting connection')
  rtm.start()
}

function handleMessage (router, handle, data) {
  const { type, text } = data
  const match = text.match(new RegExp(`^${handle}(.*)`))

  if (match) { log('msg', data) }

  if (type === 'message' && match) {
    router.dispatch(match[1].trim(), data)
  }
}

module.exports = { start, handleMessage }
