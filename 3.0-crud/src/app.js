let {identity, merge, prop} = require("ramda")
let Url = require("url")
let Class = require("classnames")
let {Observable: $, ReplaySubject} = require("rx")
let {history, pluck, store, view} = require("rx-utils")
let Cycle = require("@cycle/core")
let {a, makeDOMDriver} = require("@cycle/dom")

let {snd} = require("../../helpers")
let {makeURLDriver, makeLogDriver} = require("../../drivers")

let {isActiveUrl, isActiveRoute} = require("./routes")
let seeds = require("./seeds/app")

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  // CURRENT PAGE
  let pageHistory = src.navi
    .sample(src.navi::view("route")) // remount only when page *type* changes...
    .scan((prevPage, navi) => {
      // Unsubscribe previous page (if there was)
      if (prevPage && prevPage.subscriptions) {
        prevPage.subscriptions.forEach((s) => s.dispose())
      }

      // Make disposable sinks
      let sinkProxies = {
        redirect: new ReplaySubject(1),
        update: new ReplaySubject(1),
        DOM: new ReplaySubject(1),
        log: new ReplaySubject(1),
        state2: new ReplaySubject(1),
      }

      // Run page
      let sinks = merge({
        redirect: $.empty(), // affects navi
        update: $.empty(),   // affects state
        log: $.empty(),      // affects log
        DOM: $.empty(),      // affects DOM
        state2: $.empty(),   // nested state loop
      }, navi.page(merge(src, {state2: sinkProxies.state2})))

      // Subscribe current page
      let subscriptions = [
        sinks.redirect.subscribe(sinkProxies.redirect.asObserver()),
        sinks.update.subscribe(sinkProxies.update.asObserver()),
        sinks.DOM.subscribe(sinkProxies.DOM.asObserver()),
        sinks.log.subscribe(sinkProxies.log.asObserver()),
        sinks.state2.subscribe(sinkProxies.state2.asObserver()),
      ]

      return {navi, sinks: sinkProxies, subscriptions}
    }, {})
    ::history(2)
    .shareReplay(1)

  pageHistory.subscribe(([prev, curr]) => {
    if (prev) {
      console.log("leaving:", prev.navi)
    }
    console.log("entering:", curr.navi)
  })

  let page = pageHistory
    .map(snd)
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

    state2: page.flatMapLatest(prop("state2")),

    log: page.flatMapLatest(prop("log")),

    DOM: page.flatMapLatest(prop("DOM")),

    URL: navi::view("url"),
  }
}

Cycle.run(main, {
  navi: identity,

  state: identity,

  state2: identity,

  log: makeLogDriver(),

  DOM: makeDOMDriver("#app"),

  URL: makeURLDriver(),
})
