const pg = require('pg')
const invariant = require('invariant')
const log = process.env.NODE_ENV === 'development'
  ? require('debug')('dr:db') : () => {}

let conn = process.env.DATABASE_URL
invariant(conn, 'No DATABASE_URL specified')
if (process.env.NODE_ENV === 'test') { conn += '_test' }

const tables = `CREATE TABLE IF NOT EXISTS checkins (
  id serial PRIMARY KEY,
  user_id varchar(40) NOT NULL,
  location varchar(255)
)`

function query (query) {
  log(query)

  return new Promise((resolve, reject) => {
    pg.connect(conn, (err, client, done) => {
      if (err) {
        log('error', err)
        return reject(err)
      }

      client.query(query, (err, result) => {
        done()

        if (err) {
          log('error', err)
          return reject(err)
        }

        resolve(result)
      })
    })
  })
}

query(tables).then(log)

module.exports = { query }
