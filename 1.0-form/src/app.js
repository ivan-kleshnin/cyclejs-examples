let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  let username = src.DOM.select("#username")
    .events("input")
    .map((event) => event.target.value)
    .startWith("")

  let email = src.DOM.select("#email")
    .events("input")
    .map((event) => event.target.value)
    .startWith("")

  return {
    DOM: Observable.combineLatest(
      username, email,
      (username, email) => {
        return div([
          h1("Registration"),
          div(".form-element", [
            label({htmlFor: "username"}, "Username:"),
            br(),
            input("#username", {type: "text", autocomplete: "off"}),
          ]),
          div(".form-element", [
            label({htmlFor: "email"}, "Email:"),
            br(),
            input("#email", {type: "text", autocomplete: "off"}),
          ]),
          hr(),
          h2("State SPY"),
          pre(JSON.stringify({username, email}, null, 2)),
        ])
      }
    )
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver("#app"),
})