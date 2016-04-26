let {curry, find, takeLast} = require("ramda")

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

exports.routes = routes

// Simplest solution of cyclic dependency: routes <-> pages
window.doroute = doroute(routes) // prefixed with "do" to avoid noun-vs-verb confusion
