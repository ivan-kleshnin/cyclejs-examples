let {div} = require("@cycle/dom")

module.exports = function ({navi}) {
  let {aa} = navi
  return div([
    div(aa({href: "/"}, "Home")),
    div(aa({href: "/users"}, "Users")),
  ])
}