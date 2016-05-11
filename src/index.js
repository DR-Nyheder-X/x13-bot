const Slack = require('@slack/client')
const { CLIENT_EVENTS, RTM_EVENTS } = Slack

const token = process.env.SLACK_TOKEN || 'xoxb-7490641431-BLSo5Hp8b6bWrHKpqw5XbS4G'
const handle = 'rd'
const Router = require('./Router')
const Filter = require('./Filter')


const rtm = new Slack.RtmClient(token, {
  logLevel: 'warn',
  dataStore: new Slack.MemoryDataStore(),
  autoReconnect: true
})

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function authenticated (data) {
  console.log('Authenticated as ' + data.self.name)
})

const router = new Router({
  checkin: (args) => { console.log(args) }
})

const filter = new Filter(handle, router)

rtm.on(RTM_EVENTS.MESSAGE, function message (data) {
  const { type, text } = data
  if (type === 'text') { filter.apply(text) }
})

console.log('Sarting connection')
rtm.start()
