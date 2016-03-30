let {append, compose, curry, filter, find, flip, map, take, transduce} = require("ramda")

// always :: a -> b -> a
let always = curry((x, y) => x)

// route :: [[Route, Page]] -> [Match, Page]
let route = curry((routes, url) => {
  let transduceFn = compose(
    map(([r, p]) => [r.match(url), p]),
    filter(([m, p]) => m),
    take(1)
  )
  return transduce(transduceFn, flip(append), [], routes)[0]
})

// unroute :: [[Route, Page]] -> Page -> Params -> URL
let unroute = curry((routes, page, params) => {
  return find(([_, p]) => p == page, routes)[0].reverse(params)
})

// isActiveURL :: URL -> URL -> Boolean
let isActiveURL = curry((currentUrl, url) => {
  if (url == "/") {
    return url == currentUrl
  } else {
    return currentUrl.startsWith(url) // TODO handle trailing slashes, etc.
  }
})

exports.always = always
exports.route = route
exports.unroute = unroute
exports.isActiveURL = isActiveURL