require('dotenv').load()

global.Promise = require('bluebird')

const token = process.env.SLACK_TOKEN
require('./Client').start(token, 'rd')
