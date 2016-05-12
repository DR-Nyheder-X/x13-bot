const { query } = require('./DB')

class Location {
  static set (id, location) {
    return query(`
                 INSERT INTO checkins
                 (user_id, location) VALUES ('${id}', '${location}')
                 `).then((res) => res.rowCount)
  }

  static get (id) {
    return query(`
                 SELECT * FROM checkins
                 WHERE user_id = '${id}'
                 ORDER BY id DESC
                 LIMIT 1
                 `).then((res) => res.rows[0])
  }

  static all () {
    return query(`
                 SELECT DISTINCT ON (user_id) *
                 FROM checkins
                 ORDER BY user_id, id DESC
                 `).then((res) => res.rows)
  }
}

module.exports = Location
