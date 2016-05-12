const chai = require('chai')
global.expect = chai.expect
global.assert = chai.assert

global.Promise = require('bluebird')

require('dotenv').load()
