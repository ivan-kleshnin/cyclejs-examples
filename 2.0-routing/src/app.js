let {identity, merge, prop} = require("ramda")
let Class = require("classnames")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {a, makeDOMDriver} = require("@cycle/dom")
let {makeURLDriver} = require("./drivers")
let {pluck, store, view} = require("./rx.utils.js")
require("./routes")

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  // CURRENT PAGE
  let page = src.navi
    .sample(src.navi::view("route"))  // remount only when page *type* changes...
    .map(({component}) => merge({
        DOM: Observable.never(),      // affects DOM
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
  let updateNavi = intents.redirect.distinctUntilChanged()

  let navi = updateNavi
    .startWith(window.location.pathname)
    .map((url) => {
      let [route, component] = window.doroute(url)

      return {
        url,       // :: String
        route,     // :: String
        component, // :: {Observable *} -> {Observable *}
      }
    }).distinctUntilChanged().shareReplay(1).delay(1) // suppress bug-prone sync behavior

  return {
    navi: navi,

    DOM: page.flatMapLatest(prop("DOM")),

    URL: navi::view("url"),
  }
}

Cycle.run(main, {
  navi: identity,

  DOM: makeDOMDriver("#app"),

  URL: makeURLDriver(),
})
