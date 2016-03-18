let {curry, identity, map, pipe} = require("ramda")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {a, div, li, makeDOMDriver, h1, html, p, section, ul} = require("@cycle/dom")
let {always} = require("./helpers")
let {store, storeUnion} = require("./rx.utils")
let Class = require("classnames")

let Menu = function () {
  let isActive = function (url) {
    if (window.location.pathname == "/") {
      return url == window.location.pathname
    } else {
      return url.startsWith(window.location.pathname) // TODO handle trailing slashes, etc.
    }
  }

  return {
    DOM: Observable.of(
      div([
        div([
          div(a({href: "/", className: Class({active: isActive("/")})}, "Home")),
          div(a({href: "/about", className: Class({active: isActive("/about")})}, "About")),
          div(a({href: "/users", className: Class({active: isActive("/users")})}, "Users")),
        ]),
      ])
    )
  }
}

let Home = function () {
  return {
    DOM: Observable.combineLatest(
      Menu().DOM,
      (menu) => {
        return div([
          h1("Home"),
          menu,
          p(["[home content]"])
        ])
      }
    )
  }
}

let About = function () {
  return {
    DOM: Observable.combineLatest(
      Menu().DOM,
      (menu) => {
        return div([
          h1("About"),
          menu,
          p(["[about content]"])
        ])
      }
    )
  }
}

let Users = function () {
  return {
    DOM: Observable.combineLatest(
      Menu().DOM,
      (menu) => {
        return div([
          h1("Users"),
          menu,
          p(["[users content]"])
        ])
      }
    )
  }
}

let NotFound = function () {
  return {
    DOM: Observable.combineLatest(
      Menu().DOM,
      (menu) => {
        return div([
          h1("NotFound"),
          div(a({href: "/"}, "Home"))
        ])
      }
    )
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
      changeUrl: DOM.select("a:not([rel=external])") // not bullet-proof check...
        .events("click")
        .do((event) => {
          event.preventDefault()
        })
        .map((event) => event.target.attributes.href.value)
        .do((url) => {
          if (window !== undefined) {
            window.history.pushState(null, "", url) // no associated state, no title
          }
        })
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
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver("#app"),
  state: identity
})
