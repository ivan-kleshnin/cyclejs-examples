let {append, assoc, curry, identity} = require("ramda")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")
let {always} = require("./helpers")
let {scanFn} = require("./rx.utils")
let {User} = require("./models")

// main :: {Observable *} -> {Observable *}
function main({DOM, state: stateSource}) {
  // Intents
  let intents = {
    form: {
      changeUsername: DOM.select("#username")
        .events("input")
        .map((event) => event.target.value)
        .share(),

      changeEmail: DOM.select("#email")
        .events("input")
        .map((event) => event.target.value)
        .share(),

      register: DOM.select("#register")
        .events("click")
        .map((event) => true)
        .share(),
    },
  }

  // Actions
  let actions = {
    users: {
      create: stateSource
        .sample(intents.form.register)
        .map((state) => state.form.input)
        .map((input) => User(input))      // ---{email: "foo@dotcom"...}---{email: "bar@dotcom"}--->
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
    },
  }

  // Updates
  let updates = {
    // Persistent
    users: {
      data: Observable.merge(
        actions.users.create.map((user) => append(user))
      ),
    },

    // Fluid
    form: {
      input: Observable.merge(
        intents.form.changeUsername
          .startWith("")
          .map(username => assoc("username", username)),

        intents.form.changeEmail
          .startWith("")
          .map(email => assoc("email", email)),

        intents.form.register.map((_) => always(seeds.form.input)) // reset `form`
      ),
    },
  }

  // State
  let state = {
    // Persistent
    users: {
      data: updates.users.data
        .startWith(seeds.users)
        .scan(scanFn)
        .shareReplay(1)
        .distinctUntilChanged()
    },

    // Fluid
    form: {
      input: updates.form.input
        .startWith(seeds.form)
        .scan(scanFn)
        .shareReplay(1)
        .distinctUntilChanged()
    },
  }

  let stateSink = Observable.combineLatest(
    state.users.data, state.form.input,
    (data, input) => ({
      users: {data},
      form: {input}
    })
  )

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