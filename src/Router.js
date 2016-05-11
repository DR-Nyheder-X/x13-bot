function Router (routes) {
  this.routes = routes
}

Router.prototype.dispatch = function dispatch (cmd) {
  console.log(`DISPATCH:${cmd}`)
  const [ action, ...rest ] = cmd.split(' ')
  console.log({action, rest})
  // this.routes[cmd](args)
}

module.exports = Router
