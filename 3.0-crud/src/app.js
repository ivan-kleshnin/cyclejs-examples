let {identity, merge, prop} = require("ramda")
let Url = require("url")
let Class = require("classnames")
let {Observable: $, ReplaySubject} = require("rx")
let Cycle = require("@cycle/core")
let {a, makeDOMDriver} = require("@cycle/dom")

let {makeURLDriver, makeLogDriver} = require("../../drivers")
let {pluck, store, view} = require("../../rx.utils.js")

let {isActiveUrl, isActiveRoute} = require("./routes")
let seeds = require("./seeds/app")

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  // CURRENT PAGE
  let page = src.navi
    .sample(src.navi::view("route")) // remount only when page *type* changes...
    .map((navi) => {
      let state2 = new ReplaySubject(1)
      let sources = merge(src, {state2})

      // Run page
      let sinks = merge({
        redirect: $.empty(), // affects navi
        update: $.empty(),   // affects state
        DOM: $.empty(),      // affects DOM
        log: $.empty(),      // affects log
        state2: $.empty(),   // nested state loop
      }, navi.page(sources))

      let subscriptions = [
        sinks.state2.subscribe(state2.asObserver()),
      ]

      return {navi, sinks, subscriptions}
    })
    .scan((prevPage, currPage) => {
      if (prevPage.subscriptions) {
        prevPage.subscriptions.forEach((s) => s.dispose())
      }
      return currPage
    }, {})
    .pluck("sinks")
    .shareReplay(1)

  // INTENTS
  let intents = {
    redirect: src.DOM.select("a:not([rel=external])")
      .events("click")
      .filter((event) => !(/:\/\//.test(event.target.getAttribute("href")))) // drop links with protocols (as external)
      .do((event) => event.preventDefault())
      ::pluck("target.href")             // pick normalized property
      .map((url) => Url.parse(url).path) // keep pathname + querystring only
      .share(),
  }

  // NAVI
  let navi = $.merge(intents.redirect, page.flatMapLatest(prop("redirect")))
    .startWith(window.location.pathname)
    .distinctUntilChanged()
    .map((url) => {
      let [route, params, page] = window.doroute(url)

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
        page,                                // :: {Observable *} -> {Observable *}
        isActiveUrl: isActiveUrl(url),       // :: String -> Boolean
        isActiveRoute: isActiveRoute(route), // :: String -> Boolean
        aa,
      }
    })
    .distinctUntilChanged().shareReplay(1)
    .delay(1) // shift to the next tick (navi <- routing: immediate)

  // STATE
  let state = store(seeds, $.merge(
    // ...
    page.flatMapLatest(prop("update"))
  ))

  // SINKS
  return {
    navi: navi,

    state: state,

    DOM: page.flatMapLatest(prop("DOM")),

    URL: navi::view("url"),

    log: page.flatMapLatest(prop("log")),
  }
}

Cycle.run(main, {
  navi: identity,

  state: identity,

  DOM: makeDOMDriver("#app"),

  URL: makeURLDriver(),

  log: makeLogDriver(),
})
