let {div} = require("@cycle/dom")

module.exports = function ({navi}) {
  let {aa} = navi
  return div([
    div(aa({href: "/"}, "Home")),
    div(aa({href: "/about"}, "About")),
    div(aa({href: "/complex"}, "Complex")),
    div(aa({href: "/complex2"}, "Complex2")),
    div(aa({href: "/users"}, "Users")),
    div(aa({href: "/broken"}, "Broken")),
  ])
}