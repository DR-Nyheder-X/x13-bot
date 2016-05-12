const log = process.env.NODE_ENV === 'development'
  ? require('debug')('dr:router') : () => {}

class Router {
  constructor (rtm, routes) {
    this.routes = Object.keys(routes).reduce((compiledRoutes, key) => {
      compiledRoutes[key] = new routes[key](rtm)
      return compiledRoutes
    }, {})
  }

  dispatch (cmd, data) {
    let [ action, ...rest ] = cmd.split(' ')
    rest = rest.join(' ')
    log(JSON.stringify(action))
    this.routes[action].call(rest, data)
  }
}

module.exports = Router
