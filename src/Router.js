const log = process.env.NODE_ENV === 'development'
  ? require('debug')('dr:router') : () => {}

class Router {
  constructor (rtm, routes) {
    this.rtm = rtm

    // Initiate all routes and connect them to `rtm`
    this.routes = Object.keys(routes).reduce((compiledRoutes, key) => {
      compiledRoutes[key] = new routes[key](rtm, this)
      return compiledRoutes
    }, {})
  }

  dispatch (cmd, data) {
    let [ action, ...rest ] = cmd.split(' ')
    rest = rest.join(' ')
    log(JSON.stringify(action))

    if (action === '' && this.routes.help) {
      this.routes.help.call(rest, data)
    } else if (this.routes[action]) {
      this.routes[action].call(rest, data)
    } else {
      this.rtm.sendMessage(`I don\'t know how to _${action}_`, data.channel, log)
      if (this.routes.help) { this.routes.help.call(rest, data) }
    }
  }
}

module.exports = Router
