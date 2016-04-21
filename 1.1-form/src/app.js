let {assoc} = require("ramda")
let {Observable: $} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")

let {scanFn} = require("../../rx.utils")

// SEEDS
let seeds = {
  username: "",
  email: "",
}

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  // INTENTS
  let intents = {
    changeUsername: src.DOM.select("#username")
      .events("input")
      .map((event) => event.target.value)
      .share(),

    changeEmail: src.DOM.select("#email")
      .events("input")
      .map((event) => event.target.value)
      .share(),
  }

  // STATE
  let state = $
    .merge(
      // Track fields
      intents.changeUsername.map((v) => assoc("username", v)),
      intents.changeEmail.map((v) => assoc("email", v))
    )
    .startWith(seeds)
    .scan(scanFn)
    .distinctUntilChanged()
    .shareReplay(1)

  // SINKS
  return {
    DOM: state.map((state) => {
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
        pre(JSON.stringify(state, null, 2)),
      ])
    })
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver("#app"),
})