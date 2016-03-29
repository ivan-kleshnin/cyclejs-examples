let {append, assoc, curry, identity} = require("ramda")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")
let {always} = require("./helpers")
let {clickReader, derive, inputReader, overState, pluck, setState, store, toState} = require("./rx.utils")
let {User} = require("./types")
let {makeUser} = require("./makers")

// main :: {Observable *} -> {Observable *}
function main({DOM, state: stateSource}) {
  // Intents
  let intents = {
    form: {
      changeUsername: inputReader(DOM.select("#username")),
      changeEmail: inputReader(DOM.select("#email")),
      register: clickReader(DOM.select("#register")),
    },
  }

  // Actions
  let actions = {
    users: {
      create: stateSource
        .sample(intents.form.register)
        ::pluck("form.output")
        .filter(identity)
    },
  }

  // Seeds
  let seeds = {
    form: {
      input: {
        username: "",
        email: "",
      },
      output: null,
    },
    users: [],
  }

  // Update
  let update = Observable.merge(
    intents.form.changeUsername::toState("form.input.username"),
    intents.form.changeEmail::toState("form.input.email"),
    intents.form.register::setState("form.input", always(seeds.form.input)),
    actions.users.create::overState("users", (u) => append(u))
  )

  // State
  let stateSink = store(seeds, update)
    ::derive(["form.input"], "form.output", (input) => {
      try {
        return makeUser(input)
      } catch (err) {
        if (err instanceof TypeError) {
          return null
        } else {
          throw err
        }
      }
    })

  // View
  return {
    DOM: stateSink.map((state) => {
      return div([
        h1("Registration"),
        div(".form-element", [
          label({htmlFor: "username"}, "Username:"),
          br(),
          input("#username", {type: "text", value: state.form.input.username}),
        ]),
        div(".form-element", [
          label({htmlFor: "email"}, "Email:"),
          br(),
          input("#email", {type: "text", value: state.form.input.email}),
        ]),
        button("#register.form-element", {type: "submit", disabled: !state.form.output}, "Register"),
        hr(),
        h2("State SPY"),
        pre(JSON.stringify(state, null, 2)),
      ])
    }),
    state: stateSink,
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver("#app"),
  state: identity,
})