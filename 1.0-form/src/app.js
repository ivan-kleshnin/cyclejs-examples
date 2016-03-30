let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")

// main :: {Observable *} -> {Observable *}
let main = function ({DOM}) {
  let username = DOM.select("#username")
    .events("input")
    .map((event) => event.target.value)
    .startWith("")

  let email = DOM.select("#email")
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
            input("#username", {type: "text"}),
          ]),
          div(".form-element", [
            label({htmlFor: "email"}, "Email:"),
            br(),
            input("#email", {type: "text"}),
          ]),
          hr(),
          h2("Register SPY"),
          (username && email) ?
            pre(JSON.stringify({username, email})) :
            null,
        ])
      }
    )
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver("#app"),
})