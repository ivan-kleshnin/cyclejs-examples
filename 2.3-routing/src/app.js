let {curry} = require("ramda")
let Class = require("classnames")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {a, makeDOMDriver} = require("@cycle/dom")
let {isActiveURL, route, unroute} = require("./helpers")
let {makeURLDriver} = require("./drivers")
let {derive, pluck, store, toState} = require("./rx.utils.js")
let routes = require("./routes")

// `route` / `unroute` fns and components are always in cyc-dep. Solvable through global var (here) or proxies
window.route = route(routes)
window.unroute = unroute(routes)

// main :: {Observable *} -> {Observable *}
let main = function ({DOM}) {
  let intents = {
    navi: {
      changeUrl: DOM.select("a:not([rel=external])")
        .events("click")
        .filter((event) => {
          return !(/:\/\//.test(event.target.attributes.href.value)) // filter protocol-less links
        })
        .do((event) => {
          event.preventDefault()
        })
        .map((event) => event.target.attributes.href.value)
        .share(),
    },
  }
  
  let seeds = {
    navi: {
      url: window.location.pathname,
    },
    hs: {
      // ...
    },
  }
  
  let update = Observable.merge(
    intents.navi.changeUrl::toState("navi.url")
  )

  let state = store(seeds, update)
    ::derive(["navi.url"], "navi.isActive", isActiveURL)
    ::derive(["navi.isActive"], "hs.aa", (isActive) => {
      return function aa(...args) {
        let vnode = a(...args)
        let {href, className} = vnode.properties
        vnode.properties.className = Class(className, {active: isActive(href)})
        return vnode
      }
    })

  return {
    DOM: state
      ::pluck("navi.url")
      .map(window.route)
      .flatMapLatest(([params, page]) => {
        return page({state, params: Observable.of(params)}).DOM
      }),

    URL: state::pluck("navi.url"),
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver("#app"),
  URL: makeURLDriver(),
})
