let {identity, merge, prop} = require("ramda")
let Class = require("classnames")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {a, makeDOMDriver} = require("@cycle/dom")
let {makeURLDriver} = require("./drivers")
let {pluck, store, view} = require("./rx.utils.js")
let {isActiveUrl, isActiveRoute} = require("./routes")
let seeds = require("./seeds")

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  // CURRENT PAGE
  let page = src.navi
    .sample(src.navi::view("route"))  // remount only when page *type* changes...
    .map(({component}) => merge({
        redirect: Observable.empty(), // affects navi
        update: Observable.empty(),   // affects state
        DOM: Observable.empty(),      // affects DOM
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
  let updateNavi = Observable.merge(
    intents.redirect,
    page.flatMapLatest(prop("redirect"))
  )

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
  let update = Observable.merge(
    // ...put global updates here
    page.flatMapLatest(prop("update"))
  )

  let state = store(seeds, update)

  return {
    navi: navi,

    state: state,

    DOM: page.flatMapLatest(prop("DOM")),

    URL: navi::view("url"),
  }
}

Cycle.run(main, {
  navi: identity,

  state: identity,

  DOM: makeDOMDriver("#app"),

  URL: makeURLDriver(),
})
