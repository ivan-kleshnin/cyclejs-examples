let R = require("ramda")
let {append, assoc, assocPath, curry, identity, merge} = require("ramda")
let {Observable} = require("rx")
let {validate} = require("tcomb-validation")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")
let {always} = require("./helpers")
let {clickReader, inputReader, store, scanFn} = require("./rx.utils")
let {User} = require("./types")
let {makeUser} = require("./makers")

// main :: {Observable *} -> {Observable *}
let main = function ({DOM, state: stateSource}) {
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
      create: stateSource.map(state => state.form.output)
        .sample(intents.form.register)
        .filter(identity) // ---User(...)---User(...)---> TODO Maybe
    },
  }

  // Seeds
  let seeds = {
    // Persistent
    users: {
      data: [],
    },

    // Fluid
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
  }

  // Updates
  let updates = { // Worse #1 complicated operations
    // Persistent
    users: {
      data: Observable.merge(
        actions.users.create.map((user) => (state) => assocPath(["users", "data"], append(user, state.users.data), state))
      ),
    },

    // Fluid
    form: {
      input: Observable.merge(
        intents.form.changeUsername.map(username => assocPath(["form", "input", "username"], username)),
        intents.form.changeEmail.map(email => assocPath(["form", "input", "email"], email)),
        intents.form.register.map((_) => assocPath(["form", "input"], seeds.form.input)),
      ),
      errors: Observable.merge(
        intents.form.changeUsername.debounce(500)
          .map(username => validate(username, User.meta.props.username).firstError())
          .map(error => assocPath(["form", "errors", "username"], error && error.message || null)),
        intents.form.changeEmail.debounce(500)
          .map(email => validate(email, User.meta.props.email).firstError())
          .map(error => assocPath(["form", "errors", "email"], error && error.message || null)),
        intents.form.register.map((_) => assocPath(["form", "errors"], seeds.form.errors))
      ),
    },
  }

  // Worse #2. Manual update combining
  let update = Observable.merge(updates.users.data, updates.form.input, updates.form.errors)

  // State Better #1. No DRY violation (seeds vs streams vs driver)
  let stateSink = store(seeds, update) // Worse #3. does not correspond to updates (1-stream vs N-streams)

  // Derived state. Worse #4. make var name
  let formOutput = stateSink.map(state => {
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
    .startWith(null)

  // # Worse #5 Manual reassign (or make var name)
  stateSink = Observable.combineLatest(stateSink, formOutput, (state, formOutput) => { // Worse #6. stream op instead of a static op
    return assocPath(["form", "output"], formOutput, state)
  })

  // View
  return {
    DOM: stateSink.map((state) => { // Better #1. no need for storeUnion
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

  // Better # 2
  state: identity,
})