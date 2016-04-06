let {a, div} = require("@cycle/dom")

module.exports = function ({navi}) {
  return div([
    div(a({href: "/"}, "Home")),
    div(a({href: "/about"}, "About")),
    div(a({href: "/broken"}, "Broken")),
  ])
}