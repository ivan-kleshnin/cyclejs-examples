let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")

// main :: {Observable *} -> {Observable *}
function main({DOM}) {
  // Actions
  let actions = {
    changeUsername: DOM.select("#username")
      .events("input")
      .map((event) => event.target.value)
      .startWith(""),

    changeEmail: DOM.select("#email")
      .events("input")
      .map((event) => event.target.value)
      .startWith(""),
  }

  // State
  let state = {
    username: actions.changeUsername,
    email: actions.changeEmail,
  }

  return {
    DOM: Observable.combineLatest(
      state.username, state.email,
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