let {append, assoc, curry, identity} = require("ramda")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")
let {always} = require("./helpers")
let {overState, pluck, scanFn, setState, toState} = require("./rx.utils")
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
    intents.form.changeUsername::toState("form.username"),
    intents.form.changeEmail::toState("form.email"),
    intents.form.register.delay(1)::setState("form", always(seeds.form)),
    actions.users.create::overState("users", (u) => append(u))
  )

  // State
  let stateSink = update
    .startWith(seeds)
    .scan(scanFn)
    .distinctUntilChanged()
    .shareReplay(1)

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