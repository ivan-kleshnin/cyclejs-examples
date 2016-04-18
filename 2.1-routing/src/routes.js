let {curry, find, takeLast} = require("ramda")
let Url = require("url")
let {trailWith} = require("./helpers")

let routes = [
  ["/", require("./pages/home")],
  ["/about", require("./pages/about")],
  ["*", require("./pages/not-found")],
]

// doroute :: [[String, Component]] -> String -> [String, Component]
let doroute = curry((routes, url) => {
  let match = find(([r, _]) => r == url, routes)
  if (!match) {
    match = takeLast(1, routes)[0]
  }
  return [match[0], match[1]]
})

// isActiveUrl :: String -> String -> Boolean
let isActiveUrl = curry((baseUrl, currentUrl, url) => {
  baseUrl = trailWith("/", Url.parse(baseUrl).pathname)
  currentUrl = trailWith("/", Url.parse(currentUrl).pathname)
  url = trailWith("/", Url.parse(url).pathname)
  if (url == baseUrl) {
    return url == currentUrl // link to "home" is active only on "home"
  } else {
    return currentUrl.startsWith(url) // link to "page" is active on "page" and "page" subpages TODO handle trailing slashes, etc.
  }
})

exports.routes = routes
exports.isActiveUrl = isActiveUrl("/")

// Simplest solution of cyclic dependency: routes <-> pages
window.doroute = doroute(routes) // prefixed with "do" to avoid noun-vs-verb confusion