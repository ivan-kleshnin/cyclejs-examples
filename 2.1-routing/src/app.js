let {curry} = require("ramda")
let Class = require("classnames")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {a, div, li, makeDOMDriver, h1, html, p, section, ul} = require("@cycle/dom")
let {makeURLDriver} = require("./drivers")
let {pluck, store, toState} = require("./rx.utils.js")

let isActiveURL = curry((currentUrl, url) => {
  if (url == "/") {
    return url == currentUrl
  } else {
    return currentUrl.startsWith(url) // TODO handle trailing slashes, etc.
  }
})

let Menu = function (state) {
  return state.map((state) => {
    let isActive = isActiveURL(state.navi.url)
    return div([
      div(a({href: "/", className: Class({active: isActive("/")})}, "Home")),
      div(a({href: "/about", className: Class({active: isActive("/about")})}, "About")),
      div(a({href: "/users", className: Class({active: isActive("/users")})}, "Users")),
      div(a({href: "/broken", className: Class({active: isActive("/broken")})}, "Broken")),
    ])
  })
}

let Home = function ({state}) {
  return {
    DOM: Menu(state).map((menu) => {
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
    DOM: Menu(state).map((menu) => {
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
    DOM: Menu(state).map((menu) => {
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
    DOM: Menu(state).map((menu) => {
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
  } else if (url == "/users") {
    return Users
  } else {
    return NotFound
  }
}

// main :: {Observable *} -> {Observable *}
let main = function ({DOM}) {
  let intents = {
    navi: {
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
    navi: {
      url: window.location.pathname,
    }
  }
  
  let update = Observable.merge(
    intents.navi.changeUrl::toState("navi.url")
  )

  let state = store(seeds, update)

  return {
    DOM: state
      ::pluck("navi.url")
      .map(route)
      .flatMapLatest((page) => page({state}).DOM),

    URL: state::pluck("navi.url"),
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver("#app"),
  URL: makeURLDriver(),
})
