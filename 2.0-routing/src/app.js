let {identity, merge, prop} = require("ramda")
let Url = require("url")
let Class = require("classnames")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {a, makeDOMDriver} = require("@cycle/dom")
let {makeURLDriver, makeConsoleDriver} = require("./drivers")
let {pluck, store, view} = require("./rx.utils.js")
require("./routes")

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  // CURRENT PAGE
  let page = src.navi
    .sample(src.navi::view("route"))  // remount only when page *type* changes...
    .map(({component}) => merge({
        DOM: Observable.empty(), // affects DOM
      }, component(src))
    ).shareReplay(1)

  // INTENTS
  let intents = {
    redirect: src.DOM.select("a:not([rel=external])")
      .events("click")
      .filter((event) => !(/:\/\//.test(event.target.getAttribute("href")))) // drop links with protocols (as external)
      .do((event) => event.preventDefault())
      .map((event) => event.target.href) // pick normalized property
      .map((url) => Url.parse(url).path) // keep pathname + querystring only
      .share(),
  }

  // NAVI
  let updateNavi = intents.redirect

  let navi = updateNavi
    .startWith(window.location.pathname)
    .distinctUntilChanged()
    .map((url) => {
      let [route, component] = window.doroute(url)

      return {
        url,       // :: String
        route,     // :: String
        component, // :: {Observable *} -> {Observable *}
      }
    })
    .distinctUntilChanged().shareReplay(1)
    .delay(1) // shift to the next tick (navi <- routing: immediate)

  return {
    navi: navi,

    DOM: page.flatMapLatest(prop("DOM")),

    URL: navi::view("url"),

    console: page.flatMapLatest(prop("console")),
  }
}

Cycle.run(main, {
  navi: identity,

  DOM: makeDOMDriver("#app"),

  URL: makeURLDriver(),
  
  console: makeConsoleDriver(), 
})
