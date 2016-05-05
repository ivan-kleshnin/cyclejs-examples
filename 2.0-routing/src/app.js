let {identity, merge, prop} = require("ramda")
let Url = require("url")
let Class = require("classnames")
let {Observable: $, ReplaySubject} = require("rx")
let Cycle = require("@cycle/core")
let {a, makeDOMDriver} = require("@cycle/dom")

let {makeURLDriver, makeLogDriver} = require("../../drivers")
let {pluck, store, view} = require("../../rx.utils.js")

require("./routes")

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  // CURRENT PAGE
  let page = src.navi
    .sample(src.navi::view("route")) // remount only when page *type* changes...
    .scan((prevPage, navi) => {
      // Unsubscribe previous page (if there was)
      if (prevPage.subscriptions) {
        prevPage.subscriptions.forEach((s) => s.dispose())
      }

      // Make disposable sinks
      let sinkProxies = {
        DOM: new ReplaySubject(1),
        log: new ReplaySubject(1),
      }

      // Run page
      let sinks = merge({
        log: $.empty(),      // affects log
        DOM: $.empty(),      // affects DOM
      }, navi.page(src))

      // Subscribe current page
      let subscriptions = [
        sinks.DOM.subscribe(sinkProxies.DOM.asObserver()),
        sinks.log.subscribe(sinkProxies.log.asObserver()),
      ]

      return {navi, sinks: sinkProxies, subscriptions}
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
  let updateNavi = $.merge(
    intents.redirect
    // ...
  )

  let navi = updateNavi
    .startWith(window.location.pathname)
    .distinctUntilChanged()
    .map((url) => {
      let [route, page] = window.doroute(url)

      return {
        url,   // :: String
        route, // :: String
        page,  // :: {Observable *} -> {Observable *}
      }
    })
    .distinctUntilChanged().shareReplay(1)
    .delay(1) // shift to the next tick (navi <- routing: immediate)

  // SINKS
  return {
    navi: navi,

    log: page.flatMapLatest(prop("log")),

    DOM: page.flatMapLatest(prop("DOM")),

    URL: navi::view("url"),
  }
}

Cycle.run(main, {
  navi: identity,

  log: makeLogDriver(),

  DOM: makeDOMDriver("#app"),

  URL: makeURLDriver(),
})
