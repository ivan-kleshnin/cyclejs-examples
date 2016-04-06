let {Observable} = require("rx")
let {div, h1, p} = require("@cycle/dom")
let menu = require("../chunks/menu")

module.exports = function ({navi}) {
  return {
    DOM: navi.map((navi) => {
      console.log("render home")
      return div([
        h1("Home"),
        menu({navi}),
        p(["CRUD & Index demos"])
      ])
    })
  }
}