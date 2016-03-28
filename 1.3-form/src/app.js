let {append, assoc, curry, identity} = require("ramda")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")
let {always} = require("./helpers")
let {clickReader, inputReader, lensOver, lensSet, lensTo, pluck, scanFn, store} = require("./rx.utils")
let {User} = require("./models")

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
        ::pluck("form")
        .map((input) => User(input))
    },
  }

  // Seeds
  let seeds = {
    form: {
      username: "",
      email: "",
    },
    users: [],
  }

  // Update
  let update = Observable.merge(
    intents.form.changeUsername::lensTo("form.username"),
    intents.form.changeEmail::lensTo("form.email"),
    intents.form.register.delay(1)::lensSet("form", always(seeds.form)),
    actions.users.create::lensOver("users", (u) => append(u))
  )

  // State
  let stateSink = store(seeds, update)

  // View
  return {
    DOM: stateSink.map((state) => {
      return div([
        h1("Registration"),
        div(".form-element", [
          label({htmlFor: "username"}, "Username:"),
          br(),
          input("#username", {type: "text", value: state.form.username}),
        ]),
        div(".form-element", [
          label({htmlFor: "email"}, "Email:"),
          br(),
          input("#email", {type: "text", value: state.form.email}),
        ]),
        button("#register.form-element", {type: "submit"}, "Register"),
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