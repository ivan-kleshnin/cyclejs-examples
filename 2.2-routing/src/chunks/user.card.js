let {a, div, h2, p, span} = require("@cycle/dom")

module.exports = function ({navi, user}) {
  return (
    div([
      h2("User"),
      p(["Id: ", user.id]),
      p(["Name: ", user.username]),
      p(["Email: ", user.email]),
      p(["Points: ", user.points]),
      p(["Bonus: ", user.bonus ? user.bonus : "–"]),
      p([
        ...(
          navi.isActiveRoute("/users/:id") ?
            [] :
            [span([a({href: window.unroute("/users/:id", {id: user.id})}, "Detail")]), span(" ")]
        ),
      ])
    ])
  )
}

