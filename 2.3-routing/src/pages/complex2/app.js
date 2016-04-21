let Url = require("url")
let {a, div, h1, p, span} = require("@cycle/dom")

let menu = require("../../chunks/menu")

module.exports = function (src) {
  // INTENTS
  let intents = {
    changeState: src.DOM.select("a:not([rel=external])")
      .events("click")
      .filter((event) => !(/:\/\//.test(event.target.getAttribute("href")))) // drop links with protocols (as external)
      .do((event) => event.preventDefault())
      .map((event) => event.target.href) // pick normalized property
      .map((url) => Url.parse(url).hash) // keep hash only
      .share(),
  }

  // SINKS
  return {
    DOM: src.navi.map((navi) => {
      console.log("render complex2")
      return div([
        h1("Complex"),
        menu({navi}),
        p([
          span(a({href: "#local1"}, "Local link #1")),
          span(" "),
          span(a({href: "#local2"}, "Local link #2")),
        ])
      ])
    }),

    console: intents.changeState.map((url) => "Complex2 sees " + url),
  }
}