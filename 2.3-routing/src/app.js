let {curry, identity, map, pipe} = require("ramda")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {a, div, li, makeDOMDriver, h1, html, p, section, ul} = require("@cycle/dom")
let {always} = require("./helpers")
let {store, storeUnion} = require("./rx.utils")
let Class = require("classnames")

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
    DOM: state.map((state) => {
      return div([
        div([
          div(aa({href: "/"}, "Home")),
          div(aa({href: "/about"}, "About")),
          div(aa({href: "/users", className: "it-works"}, "Users")),
        ]),
      ])
    })
  }
}

let Home = function ({state}) {
  return {
    DOM: Observable.combineLatest(
      Menu({state}).DOM,
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

let About = function ({state}) {
  return {
    DOM: Observable.combineLatest(
      Menu({state}).DOM,
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

let Users = function ({state}) {
  return {
    DOM: Observable.combineLatest(
      Menu({state}).DOM,
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

let NotFound = function ({state}) {
  return {
    DOM: Observable.combineLatest(
      Menu({state}).DOM,
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
let main = function ({DOM, state: stateSource}) {
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


/*
function renderHomePage() {
  return section({className: "home"}, [
    renderMenu(),
    h1("Home"),
    p("Spectacular home page"),
    p(a({href: "http://paqmind.com", rel: "external"}, "External link"))
  ])
}

function renderAboutPage() {
  return section({className: "about"}, [
    renderMenu(),
    h1("About us"),
    p("Something about us"),
  ])
}

function renderUnknownPage(url) {
  return div(`Unknown page ${url}`)
}

function renderRobotIndexPage(robots) {
  return section({className: "robot-index"}, [
    renderMenu(),
    h1("Robots"),
    ul(
      pipe(
        toArray,
        map(r => li(a({href: "/robots/" + r.id}, r.name)))
      )(robots)
    )
  ])
}

function renderRobotDetailPage(robot) {
  return section({className: "robot-detail"}, [
    renderMenu(),
    h1(robot.name),
    p("Manufacturer: " + robot.manufacturer),
    p("Assembly date: " + robot.assemblyDate.format("YYYY-MM-DD")),
  ])
}

function renderMenu(router) {
  return ul({className: "home"}, [
    li(a({href: router.buildUrl("home")}, "Home")),
    li(a({href: router.buildUrl("users.index")}, "Users")),
    li(a({href: router.buildUrl("about")}, "About")),
  ])
}

function renderHomePage(toState, fromState, router) {
  console.log("toState:", toState)
  console.log("fromState:", fromState)
  console.log("router:", router)
  return section({className: "home"}, [
    renderMenu(router),
    h1("Home"),
    p("Spectacular home page"),
    p(a({href: "http://paqmind.com", rel: "external"}, "External link"))
  ])
}

function renderAboutPage(toState, fromState, router) {
  return section({className: "about"}, [
    renderMenu(router),
    h1("About us"),
    p("Something about us"),
  ])
}

function renderUnknownPage(url) {
  return div(`Unknown page ${url}`)
}

function renderIndexPage(toState, fromState, router) {
  return section({className: "user-index"}, [
    renderMenu(router),
    h1("Users"),
    ul(
      pipe(
        toArray,
        map(r => li(a({href: "/users/" + r.id}, r.name)))
      )(users)
    )
  ])
}

function renderDetailPage(toState, fromState, router) {
  return section({className: "user-detail"}, [
    renderMenu(router),
    h1(user.name),
    p("Citizenship: " + user.citizenship),
    p("Birth date: " + user.birthDate.format("YYYY-MM-DD")),
  ])
}
*/