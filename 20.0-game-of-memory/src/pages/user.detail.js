let {indexOf, keys} = require("ramda")
let {Observable} = require("rx")
let {a, div, h1, hr} = require("@cycle/dom")
let {derive, view} = require("../rx.utils")
let menu = require("../chunks/menu")
let userCard = require("../chunks/user.card")

module.exports = function ({navi, state}) {
  let user = derive(
    [navi::view("params"), state::view("users")],
    (params, users) => users[params.id]
  )

  return {
    DOM: user.withLatestFrom(
      navi, state::view("users"),
      (user, navi, users) => {
        console.log("render user.detail")
        let ids = keys(users)
        return div([
          h1("User Detail"),
          menu({navi}),
          userCard({navi, user}),
          hr(),
          a({href: window.unroute("/users/:id", {id: nextId(ids, navi.params.id)})}, "Next User"),
        ])
      }
    )
  }
}

function nextId(ids, id) {
  let n = ids.length
  if (n) {
    let i = indexOf(id, ids)
    if (i == -1) {
      return ids[0]
    } else {
      return ids[(i + 1) % n]
    }
  } else {
    throw Error("ids can't be empty")
  }
}