let {Observable} = require("rx")
let {a, div, li, h1, html, p, section, ul} = require("@cycle/dom")

let Menu = function (state) {
  return state.map((state) => {
    let {aa} = state.hyperscript
    return div([
      div(aa({href: "/"}, "Home")),
      div(aa({href: "/about"}, "About")),
      div(aa({href: "/users"}, "Users")),
      div(aa({href: "/broken"}, "Broken")),
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
        p(["[users content]"]),
        p(a({href: "/users/1"}, "user #1")),
        p(a({href: "/users/2"}, "user #2")),
        p(a({href: "/users/3"}, "user #3")),
      ])
    })
  }
}

let User = function ({state, params}) {
  return {
    DOM: Observable.combineLatest(
      Menu(state), params,
        (menu, params) => {
        return div([
          h1("User #" + params.id),
          menu,
          p(["[user"  + params.id + " content]"])
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

exports.Home = Home
exports.About = About
exports.Users = Users
exports.User = User
exports.NotFound = NotFound