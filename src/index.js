require('dotenv').load()
const token = process.env.SLACK_TOKEN
require('./Client').start(token, 'rd')
