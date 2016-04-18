let {identity, merge, prop} = require("ramda")
let Class = require("classnames")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {a, makeDOMDriver} = require("@cycle/dom")
let {makeURLDriver, makeConsoleDriver} = require("./drivers")
let {pluck, store, view} = require("./rx.utils.js")
let {isActiveUrl, isActiveRoute} = require("./routes")
let seeds = require("./seeds")

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  // CURRENT PAGE
  let page = src.navi
    .sample(src.navi::view("route"))  // remount only when page *type* changes...
    .map(({component}) => merge({
        console: Observable.empty(), // affects console
        DOM: Observable.empty(),     // affects DOM
      }, component(src))
    ).shareReplay(1)

  // INTENTS
  let intents = {
    redirect: src.DOM.select("a:not([rel=external])")
      .events("click")
      .filter((event) => {
        return !(/:\/\//.test(event.target.attributes.href.value)) // drop links with protocols (as external)
      })
      .do((event) => {
        event.preventDefault()
      })
      .map((event) => event.target.attributes.href.value)
      .share(),
  }

  // NAVI
  let updateNavi = intents.redirect

  let navi = updateNavi
    .startWith(window.location.pathname)
    .distinctUntilChanged()
    .map((url) => {
      let [route, params, component] = window.doroute(url)

      let aa = (...args) => {
        let vnode = a(...args)
        let {href, className} = vnode.properties
        vnode.properties.className = Class(className, {active: isActiveUrl(url, href)}) // TODO or rather `isActiveRoute`?
        return vnode
      }

      return {
        url,                                 // :: String
        route,                               // :: String
        params,                              // :: {*}
        component,                           // :: {Observable *} -> {Observable *}
        isActiveUrl: isActiveUrl(url),       // :: String -> Boolean
        isActiveRoute: isActiveRoute(route), // :: String -> Boolean
        aa,
      }
    })
    .distinctUntilChanged().shareReplay(1)
    .delay(1) // shift to the next tick (navi <- routing: immediate)

  // STATE
  let state = store(seeds, Observable.empty())

  return {
    navi: navi,

    state: state,

    DOM: page.flatMapLatest(prop("DOM")),

    URL: navi::view("url"),

    console: page.flatMapLatest(prop("console")),
  }
}

Cycle.run(main, {
  navi: identity,

  state: identity,

  DOM: makeDOMDriver("#app"),

  URL: makeURLDriver(),
  
  console: makeConsoleDriver(), 
})
