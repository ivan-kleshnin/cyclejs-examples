let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")
let {lensTo, scanFn} = require("./rx.utils")

// main :: {Observable *} -> {Observable *}
function main({DOM}) {
  // Intents
  let intents = {
    changeUsername: DOM.select("#username")
      .events("input")
      .map((event) => event.target.value)
      .share(),

    changeEmail: DOM.select("#email")
      .events("input")
      .map((event) => event.target.value)
      .share(),
  }

  // Seeds
  let seeds = {
    username: "",
    email: "",
  }

  // Update
  let update = Observable.merge(
    intents.changeUsername::lensTo("username"),
    intents.changeEmail::lensTo("email"),
  )

  // State
  let state = update
    .startWith(seeds)
    .scan(scanFn)
    .shareReplay(1)
    .distinctUntilChanged()

  // View
  return {
    DOM: state.map((state) => {
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
        (state.username && state.email) ?
          pre(JSON.stringify({state})) :
          null,
      ])
    })
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver("#app"),
})