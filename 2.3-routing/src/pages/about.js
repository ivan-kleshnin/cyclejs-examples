let {a, div, h1, p} = require("@cycle/dom")

let menu = require("../chunks/menu")

module.exports = function (src) {
  return {
    DOM: src.navi.map((navi) => {
      console.log("render about")
      return div([
        h1("About"),
        menu({navi}),
        p(["[about content]"]),
        p(a({href: "http://twitter.com"}, "External link (real)")),
        p(a({href: "/foobar", rel: "external"}, "External link (other app)")),
      ])
    })
  }
}
