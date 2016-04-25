let {assoc, identity} = require("ramda")
let {Observable: $} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")

let {derive, pluck, setState, store, toOverState, toState, view} = require("../../rx.utils")

let {User} = require("./types")
let {makeUser} = require("./makers")
let seeds = require("./seeds")

let Username = User.meta.props.username
let Email = User.meta.props.email

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  let textFrom = (s) => src.DOM.select(s).events("input")::pluck("target.value").share()
  let clickFrom = (s) => src.DOM.select(s).events("click").map((e) => true).share()

  // DERIVED STATE
  let model = derive((form) => {
    try {
      return makeUser(form)
    } catch (err) {
      if (err instanceof TypeError) { return null }
      else                          { throw err }
    }
  }, src.state::view("form"))

  // INTENTS
  let intents = {
    changeUsername: textFrom("#username"),
    changeEmail: textFrom("#email"),

    createUser: clickFrom("#submit").debounce(100),
  }

  // ACTIONS
  let actions = {
    createUser: model.filter(identity)
      .sample(intents.createUser)
      .share(),
  }

  // STATE
  let state = store(seeds, $.merge(
    // Track fields
    intents.changeUsername::toState("form.username"),
    intents.changeEmail::toState("form.email"),

    // Create user
    actions.createUser::toOverState("users", (u) => assoc(u.id, u)),

    // Reset form after valid submit
    actions.createUser.delay(1)::setState("form", seeds.form)
  ))

  // SINKS
  return {
    state: state,
    
    DOM: $.combineLatest(state, model)
      .debounce(1)
      .map(([state, model]) => {
        let {form} = state
        return div([
          h1("Registration"),
          div(".form-element", [
            label({htmlFor: "username"}, "Username:"),
            br(),
            input("#username", {type: "text", value: form.username, autocomplete: "off"}),
          ]),
          div(".form-element", [
            label({htmlFor: "email"}, "Email:"),
            br(),
            input("#email", {type: "text", value: form.email, autocomplete: "off"}),
          ]),
          button("#submit.form-element", {type: "submit", disabled: !model}, "Register"),
          hr(),
          h2("State SPY"),
          pre(JSON.stringify(state, null, 2)),
        ])
      }
    ),
  }
}

Cycle.run(main, {
  state: identity,

  DOM: makeDOMDriver("#app"),
})