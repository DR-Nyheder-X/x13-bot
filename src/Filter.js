function Filter (handle, router) {
  this.handle = handle
  this.router = router
}

Filter.prototype.apply = function apply (text) {
  const [match, _, cmd] = text.match(new RegExp(`^(\\s+)?${this.handle}\\s?(.*)$`))
  if (match) { this.router.dispatch(cmd) }
}

module.exports = Filter
