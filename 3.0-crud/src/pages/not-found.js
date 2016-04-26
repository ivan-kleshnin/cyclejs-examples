let {Observable} = require("rx")
let {a, div, h1, p} = require("@cycle/dom")

let menu = require("../chunks/menu")

module.exports = function (src) {
  // DOM
  let DOM = src.navi.map((navi) => {
    console.log("render not-found")
    return div([
      h1("NotFound"),
      menu({navi}),
      p(["[Not found]"])
    ])
  })

  // SINKS
  return {DOM}
}
