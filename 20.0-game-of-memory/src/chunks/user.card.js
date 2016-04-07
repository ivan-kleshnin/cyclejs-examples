let {a, div, h2, p, span} = require("@cycle/dom")
let {formatInteger, formatString} = require("../formatters")

module.exports = function ({navi, user}) {
  return (
    div([
      h2("User"),
      p(["Id: ", formatString(user.id)]),
      p(["Name: ", formatString(user.username)]),
      p(["Email: ", formatString(user.email)]),
      p(["Points: ", formatInteger(user.points)]),
      p(["Bonus: ", user.bonus ? formatInteger(user.bonus) : "–"]),
      p([
        ...(
          navi.isActiveRoute("/users/:id") ?
            [] :
            [span([a({href: window.unroute("/users/:id", {id: user.id})}, "Detail")]), span(" ")]
        ),
        ...(
          navi.isActiveRoute("/users/:id/edit") ?
            [] :
            [span([a({href: window.unroute("/users/:id/edit", {id: user.id})}, "Edit")]), span(" ")]
        ),
      ])
    ])
  )
}

