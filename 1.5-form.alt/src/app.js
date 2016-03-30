let {append, assoc, curry, identity} = require("ramda")
let {Observable} = require("rx")
let {validate} = require("tcomb-validation")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")
let {always} = require("./helpers")
let {clickReader, inputReader, store, storeUnion} = require("./rx.utils")
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
      create: stateSource.form.output
        .sample(intents.form.register)
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

  // Updates
  let updates = {
    form: {
      input: Observable.merge(
        intents.form.changeUsername.map(username => assoc("username", username)), // can't just assoc("username") here because RxJS drops index as a second argument...
        intents.form.changeEmail.map(email => assoc("email", email)),             // --//--
        intents.form.register.map((_) => always(seeds.form.input)) // reset `form`
      ),
      errors: Observable.merge(
        intents.form.changeUsername.debounce(500)
          .map(username => validate(username, User.meta.props.username).firstError())
          .map(error => assoc("username", error && error.message || null)), // TODO simplify?
        intents.form.changeEmail.debounce(500)
          .map(email => validate(email, User.meta.props.email).firstError())
          .map(error => assoc("email", error && error.message || null)), // TODO simplify?
        intents.form.register.map((_) => always(seeds.form.errors)) // reset `form.errors`
      ),
    },
    users: actions.users.create.map((user) => append(user)),
  }

  // State
  let stateSink = {
    form: {
      input: store(seeds.form.input, updates.form.input),
      errors: store(seeds.form.errors, updates.form.errors),
    },
    users: store(seeds.users.data, updates.users.data),
  }
  stateSink.form.output = stateSink.form.input
    .map((form) => {
      try {
        return makeUser(form)
      } catch (err) {
        if (err instanceof TypeError) {
          return null
        } else {
          throw err
        }
      }
    })
    .startWith(null)

  let stateUnion = storeUnion(stateSink) 

  // View
  return {
    DOM: stateUnion.map((state) => {
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
  state: {
    form: {
      input: identity,
      errors: identity,
      output: identity,
    },
    users: identity,
  },
})