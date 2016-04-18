let {curry, find} = require("ramda")
let Url = require("url")
let Route = require("route-parser")
let {withSuffix} = require("./helpers")

// TODO define document title here?!
let routes = [
  [new Route("/"), require("./pages/home")],
  [new Route("/about"), require("./pages/about")],
  [new Route("/complex"), require("./pages/complex")],
  [new Route("/complex2"), require("./pages/complex2")],
  [new Route("/users"), require("./pages/user.index")],
  [new Route("/users/:id"), require("./pages/user.detail")],
  [new Route("/*path"), require("./pages/not-found")],
]

// doroute :: [[Route, Component]] -> String -> [String, Params, Component]
let doroute = curry((routes, url) => {
  let match = find(([r, _]) => r.match(url), routes)
  if (match) {
    return [match[0].spec, match[0].match(url), match[1]]
  }
  else {
    throw Error("can't route " + url)
  }
})

// unroute :: [[Route, Component]] -> String -> Params -> String 
let unroute = curry((routes, route, params) => {
  let match = find(([r, _]) => r.spec == route, routes)
  if (match) {
    return match[0].reverse(params)
  } else {
    throw Error("unknown route " + route)
  }
})

// isActiveUrl :: String -> String -> Boolean
let isActiveUrl = curry((baseUrl, currentUrl, url) => {
  baseUrl = withSuffix("/", Url.parse(baseUrl).pathname)
  currentUrl = withSuffix("/", Url.parse(currentUrl).pathname)
  url = withSuffix("/", Url.parse(url).pathname)
  if (url == baseUrl) {
    return url == currentUrl // link to "home" is active only on "home"
  } else {
    return currentUrl.startsWith(url) // link to "page" is active on "page" and "page" subpages TODO handle trailing slashes, etc.
  }
})

// isActiveRoute :: String -> String -> Boolean
let isActiveRoute = curry((currentRoute, route) => {
  return route == currentRoute
})

exports.routes = routes
exports.isActiveUrl = isActiveUrl("/")
exports.isActiveRoute = isActiveRoute

// Simplest solution of cyclic dependency: routes <-> pages
window.doroute = doroute(routes) // prefixed with "do" to avoid noun-vs-verb confusion
window.unroute = unroute(routes)