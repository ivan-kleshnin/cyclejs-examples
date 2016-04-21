let {assoc, filter, identity, values} = require("ramda")
let {Observable: $} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")

let {flattenObject} = require("../../helpers")
let {derive, pluck, setState, store, toOverState, toState, validate, view} = require("../../rx.utils")

let {User} = require("./types")
let {makeUser} = require("./makers")
let seeds = require("./seeds")

let filterX = filter(identity)

let Username = User.meta.props.username
let Email = User.meta.props.email

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  let textFrom = (s) => src.DOM.select(s).events("input")::pluck("target.value").share()
  let clickFrom = (s) => src.DOM.select(s).events("click").map((e) => true).share()

  // INTENTS
  let intents = {
    changeUsername: textFrom("#username"),
    changeEmail: textFrom("#email"),

    createUser: clickFrom("#submit").debounce(100),
  }

  // STATE
  let state = store(seeds, $.merge(
    // Track fields
    intents.changeUsername::toState("form.username"),
    intents.changeEmail::toState("form.email"),

    // Trunk updates
    src.update
  ))

  let model = derive((form) => {
    try {
      return makeUser(form)
    } catch (err) {
      if (err instanceof TypeError) { return null }
      else                          { throw err }
    }
  }, state::view("form"))

  // STATE (errors) (TODO: better behavior after submit @_@)
  let errors = store(seeds.form, $.merge(
    state::view("form.username").skip(1)::validate(Username)::toState("username"),
    state::view("form.email").skip(1)::validate(Email)::toState("email")
  ))

  let hasErrors = derive((es) => Boolean(filterX(values(flattenObject(es))).length), errors)

  // TRUNK ACTIONS
  let trunkActions = {
    createUser: model.filter(identity)
      .sample(intents.createUser)
      .share(),
  }

  // TRUNK UPDATE
  let trunkUpdate = $.merge(
    // Create user
    trunkActions.createUser::toOverState("users", (u) => assoc(u.id, u)),

    // Reset form after valid submit
    trunkActions.createUser.delay(1)::setState("form", seeds.form)
  )

  // SINKS
  return {
    DOM: $.combineLatest(state, model, errors)
      .debounce(1)
      .map(([state, model, errors]) => {
        let {form} = state
        return div([
          h1("Registration"),
          div(".form-element", [
            label({htmlFor: "username"}, "Username:"),
            br(),
            input("#username", {type: "text", value: form.username, autocomplete: "off"}),
            p(errors.username),
          ]),
          div(".form-element", [
            label({htmlFor: "email"}, "Email:"),
            br(),
            input("#email", {type: "text", value: form.email, autocomplete: "off"}),
            p(errors.email),
          ]),
          button("#submit.form-element", {type: "submit", disabled: !model}, "Register"),
          hr(),
          h2("State SPY"),
          pre(JSON.stringify(state, null, 2)),
        ])
      }
    ),

    update: trunkUpdate,
  }
}

Cycle.run(main, {
  update: identity,

  DOM: makeDOMDriver("#app"),
})