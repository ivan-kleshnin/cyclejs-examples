let {identity, merge, prop} = require("ramda")
let Url = require("url")
let Class = require("classnames")
let {Observable: $, ReplaySubject} = require("rx")
let Cycle = require("@cycle/core")
let {a, makeDOMDriver} = require("@cycle/dom")

let {makeURLDriver, makeLogDriver} = require("../../drivers")
let {derive, pluck, store, toState, view} = require("../../rx.utils.js")

let {isActiveUrl, isActiveRoute} = require("./routes")
let seeds = require("./seeds/app")

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  // STATE
  let state = store(seeds, src.update)

  // DERIVED STATE
  let navi = derive((url) => {
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
  }, state::view("url"))

  let page = navi
    .sample(navi::view("route")) // remount only when page *type* changes...
    .scan((prevPage, {page}) => {
      // Unsubscribe previous page (if there was)
      if (prevPage.subscriptions) {
        prevPage.subscriptions.forEach((s) => s.dispose())
      }

      // Make disposable sinks
      let sinkProxies = {
        update: new ReplaySubject(1),
        update2: new ReplaySubject(1),
        DOM: new ReplaySubject(1),
        log: new ReplaySubject(1),
      }

      // Run page
      let sources = {
        update2: sinkProxies.update2.delay(1),
        navi: navi.delay(1),
        state: state.delay(1),
        DOM: src.DOM,
      }
      let sinks = merge({
        update: $.empty(),
        update2: $.empty(),
        DOM: $.empty(),
        log: $.empty(),
      }, page(sources))

      // Subscribe current page
      let subscriptions = [
        sinks.update.subscribe(sinkProxies.update.asObserver()),
        sinks.update2.subscribe(sinkProxies.update2.asObserver()),
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

  // UPDATE
  let update = $.merge(
    intents.redirect::toState("url"),
    page.flatMapLatest(prop("update"))
  )

  // SINKS
  return {
    update: update,

    update2: page.flatMapLatest(prop("update2")),

    DOM: page.flatMapLatest(prop("DOM")),

    log: page.flatMapLatest(prop("log")),

    URL: navi::view("url"),
  }
}

Cycle.run(main, {
  update: identity,

  update2: identity,

  DOM: makeDOMDriver("#app"),

  log: makeLogDriver(),

  URL: makeURLDriver(),
})
