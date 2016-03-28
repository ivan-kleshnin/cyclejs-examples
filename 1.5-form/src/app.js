let {append, assoc, curry, identity} = require("ramda")
let {Observable} = require("rx")
let {validate} = require("tcomb-validation")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")
let {always} = require("./helpers")
let {clickReader, inputReader, lensOver, lensSet, lensTo, lensView, pluck, store, withDerived} = require("./rx.utils")
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
      errors: {
        username: null,
        email: null,
      },
      output: null,
    },
    users: [],
  }

  // Update
  let update = Observable.merge(
    intents.form.changeUsername::lensTo("form.input.username"),
    intents.form.changeUsername
      .debounce(500)
      .map((username) => validate(username, User.meta.props.username).firstError())
      .map((error) => error && error.message || null)
      ::lensTo("form.errors.username"),
    intents.form.changeEmail::lensTo("form.input.email"),
    intents.form.changeEmail
      .debounce(500)
      .map((email) => validate(email, User.meta.props.email).firstError())
      .map((error) => error && error.message || null)
      ::lensTo("form.errors.email"),
    intents.form.register.delay(1)::lensSet("form.input", always(seeds.form.input)),
    intents.form.register.delay(1)::lensSet("form.errors", always(seeds.form.errors)),
    actions.users.create::lensOver("users", (u) => append(u))
  )

  // State
  let stateSink = store(seeds, update)
    ::withDerived("form.output", (state) => {
      try {
        return makeUser(state.form.input)
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
          input("#username", {type: "text", value: state.form.input.username, autocomplete: "off"}),
          p(state.form.errors.username),
        ]),
        div(".form-element", [
          label({htmlFor: "email"}, "Email:"),
          br(),
          input("#email", {type: "text", value: state.form.input.email, autocomplete: "off"}),
          p(state.form.errors.email),
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