let {append, compose, curry, filter, flip, map, take, transduce} = require("ramda")

module.exports = curry((routes, url) => {
  let transduceFn = compose(
    map(([r, p]) => [r.match(url), p]),
    filter(([m, p]) => m),
    take(1)
  )
  return transduce(transduceFn, flip(append), [], routes)[0]
})