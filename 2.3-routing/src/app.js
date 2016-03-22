let {curry, identity, map, pipe} = require("ramda")
let Class = require("classnames")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {a, div, li, makeDOMDriver, h1, html, p, section, ul} = require("@cycle/dom")
let {always} = require("./helpers")
let {store, storeUnion} = require("./rx.utils")
let {makeURLDriver} = require("./drivers")

let Menu = function ({state}) {
  let isActive = function (url) {
    if (window.location.pathname == "/") {
      return url == window.location.pathname
    } else {
      return url.startsWith(window.location.pathname) // TODO handle trailing slashes, etc.
    }
  }

  let aa = function (...args) {
    let vnode = a(...args)
    let {href, className} = vnode.properties
    vnode.properties.className = Class(className, {active: isActive(href)})
    return vnode
  }

  return {
    DOM: Observable.of(
      div([
        div([
          div(aa({href: "/"}, "Home")),
          div(aa(".foo", {href: "/about"}, "About")),
          div(aa({href: "/users", className: "bar"}, "Users")),
        ]),
      ])
    )
  }
}

let Home = function ({state}) {
  return {
    DOM: Menu({state}).map((menu) => {
      return div([
        h1("Home"),
        menu,
        p(["[home content]"])
      ])
    })
  }
}

let About = function ({state}) {
  return {
    DOM: Menu({state}).map((menu) => {
      return div([
        h1("About"),
        menu,
        p(["[about content]"]),
        p(a({href: "http://twitter.com"}, "External link (real)")),
        p(a({href: "/foobar", rel: "external"}, "External link (other app)")),
      ])
    })
  }
}

let Users = function ({state}) {
  return {
    DOM: Menu({state}).map((menu) => {
      return div([
        h1("Users"),
        menu,
        p(["[users content]"])
      ])
    })
  }
}

let NotFound = function ({state}) {
  return {
    DOM: Menu({state}).map((menu) => {
      return div([
        h1("NotFound"),
        div(a({href: "/"}, "Home"))
      ])
    })
  }
}

let route = function (url) {
  if (url == "/") {
    return Home
  } else if (url == "/about") {
    return About
  } else {
    return NotFound
  }
}

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

  let state = {
    navigation: {
      url: intents.navigation.changeUrl.startWith("/").shareReplay(1)
    }
  }

  return {
    DOM: state.navigation.url
      .map((url) => route(url))
      .flatMap((page) => page().DOM),

    URL: intents.navigation.changeUrl,
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver("#app"),
  URL: makeURLDriver(),
  state: identity
})
