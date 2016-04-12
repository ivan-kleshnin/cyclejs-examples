let {assoc, identity} = require("ramda")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")
let {always} = require("./helpers")
let {derive, overState, pluck, setState, store, toState, validateToState, view} = require("./rx.utils")
let {User} = require("./types")
let seeds = require("./seeds")
let {makeUser} = require("./makers")

// main :: {Observable *} -> {Observable *}
let main = function (src) {
  let textFrom = (s) => src.DOM.select(s).events("input")::pluck("target.value").share()
  let clickFrom = (s) => src.DOM.select(s).events("click").map((e) => true).share()

  let formModel = derive(
    [src.state::view("form.data").debounce(100)],
    (data) => {
      try {
        return makeUser(data)
      } catch (err) {
        if (err instanceof TypeError) { return null }
        else                          { throw err }
      }
    }
  ).distinctUntilChanged().shareReplay(1)
  
  // INTENTS
  let intents = {
    changeUsername: textFrom("#username"),
    changeEmail: textFrom("#email"),
    createUser: clickFrom("#submit").debounce(100),
  }

  // ACTIONS
  let actions = {
    createUser: formModel
      .sample(intents.createUser)
      .filter(identity)
      .share(),
  }

  let Username = User.meta.props.username
  let Email = User.meta.props.email

  // UPDATE
  let update = Observable.merge(
    // TODO intents.createUser <- validate form

    // Reset form after valid submit
    actions.createUser.delay(1)::setState("form", always(seeds.form)),
    
    // Track fields
    intents.changeUsername::toState("form.data.username"),
    intents.changeUsername::validateToState("form.errors.username", Username),

    intents.changeEmail::toState("form.data.email"),
    intents.changeEmail::validateToState("form.errors.email", Email),

    // Create user
    actions.createUser::overState("users", (u) => assoc(u.id, u))
  )

  // STATE
  let state = store(seeds, update)

  return {
    DOM: Observable.combineLatest(
      state, formModel,
      (state, formModel) => {
        let {form} = state
        return div([
          h1("Registration"),
          div(".form-element", [
            label({htmlFor: "username"}, "Username:"),
            br(),
            input("#username", {type: "text", value: form.data.username, autocomplete: "off"}),
            p(form.errors.username),
          ]),
          div(".form-element", [
            label({htmlFor: "email"}, "Email:"),
            br(),
            input("#email", {type: "text", value: form.data.email, autocomplete: "off"}),
            p(form.errors.email),
          ]),
          button("#submit.form-element", {type: "submit", disabled: !formModel}, "Register"),
          hr(),
          h2("State SPY"),
          pre(JSON.stringify(state, null, 2)),
        ])
      }
    ),
    
    state,
  }
}

Cycle.run(main, {
  state: identity,

  DOM: makeDOMDriver("#app"),
})