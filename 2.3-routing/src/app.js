let {curry} = require("ramda")
let Class = require("classnames")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {a, makeDOMDriver} = require("@cycle/dom")
let {makeURLDriver} = require("./drivers")
let {derive, pluck, store, toState} = require("./rx.utils.js")
let routes = require("./routes")
let route = require("./route")

let appRoute = route(routes)

let isActiveURL = curry((currentUrl, url) => {
  if (url == "/") {
    return url == currentUrl
  } else {
    return currentUrl.startsWith(url) // TODO handle trailing slashes, etc.
  }
})

// main :: {Observable *} -> {Observable *}
let main = function ({DOM}) {
  let intents = {
    navigation: {
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
    navigation: {
      url: window.location.pathname,
    },
    hyperscript: {
      // ...
    }
  }

  let update = Observable.merge(
    intents.navigation.changeUrl::toState("navigation.url")
  )

  let state = store(seeds, update)
    ::derive(["navigation.url"], "navigation.isActive", isActiveURL)
    ::derive(["navigation.isActive"], "hyperscript.aa", (isActive) => {
      return function aa(...args) {
        let vnode = a(...args)
        let {href, className} = vnode.properties
        vnode.properties.className = Class(className, {active: isActive(href)})
        return vnode
      }
    })

  return {
    DOM: state
      ::pluck("navigation.url")
      .map((url) => appRoute(url))
      .flatMap(([params, page]) => {
        return page({state, params: Observable.of(params)}).DOM
      }),

    URL: state::pluck("navigation.url"),
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver("#app"),
  URL: makeURLDriver(),
})
