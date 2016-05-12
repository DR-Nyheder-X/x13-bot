if (process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

global.Promise = require('bluebird')

const token = process.env.SLACK_TOKEN
const handle = process.env.HANDLE
require('./Client').start(token, handle)
