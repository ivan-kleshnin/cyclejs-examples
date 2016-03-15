let {append, assoc, curry, identity} = require("ramda")
let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {br, button, div, h1, h2, hr, input, label, makeDOMDriver, p, pre} = require("@cycle/dom")
let {always, clickReader, inputReader, scanFn, store, storeUnion} = require("./utils")
let {makeUser} = require("./model")
let {validateRegex} = require("./validation")

let validateUsername = validateRegex(/^\w{2,10}$/, "username is not valid")
let validateEmail = validateRegex(/^(.+)@(.+){2,}\.(.+){2,}$/, "email is not valid")

// main :: {Observable *} -> {Observable *}
function main({DOM, state: stateSource}) {
  // Actions
  let actions = {
    changeUsername: inputReader(DOM.select("#username")),
    changeEmail: inputReader(DOM.select("#email")),
    register: clickReader(DOM.select("#register")),
  }

  // Dependent actions
  actions.validateUsername = actions.changeUsername
    .skip(1) // skip seed value
    .debounce(500)
    .flatMapLatest(validateUsername)
  
  actions.validateEmail = actions.changeEmail
    .skip(1) // skip seed value
    .debounce(500)
    .flatMapLatest(validateEmail)

  // Seeds
  let seeds = {
    users: [],
    form: {
      username: "",
      email: "",
    },
    formErrors: {
      username: null,
      email: null,
    },
  }

  // Updates
  let update = {
    users: Observable.merge(
      actions.register.withLatestFrom(stateSource, (_, state) => append(makeUser(state.form)))
    ),
    form: Observable.merge(
      actions.changeUsername.map(username => assoc("username", username)),
      actions.changeEmail.map(email => assoc("email", email)),
      actions.register.map((_) => always(seeds.form)) // reset `form`
    ),
    formErrors: Observable.merge(
      actions.validateUsername.map(error => assoc("username", error)),
      actions.validateEmail.map(error => assoc("email", error)),
      actions.register.map((_) => always(seeds.formErrors)) // reset `formErrors`
    ),
  }

  // State
  let state = {
    users: store(seeds.users, update.users),
    form: store(seeds.form, update.form),
    formErrors: store(seeds.formErrors, update.formErrors),
  }

  let stateSink = storeUnion(["users", "form", "formErrors"], state)

  // View
  return {
    DOM: stateSink.map((state) => {
      return div([
        h1("Registration"),
        div(".form-element", [
          label({htmlFor: "username"}, "Username:"),
          br(),
          input("#username", {type: "text", value: state.form.username}),
          p(state.formErrors.username),
        ]),
        div(".form-element", [
          label({htmlFor: "email"}, "Email:"),
          br(),
          input("#email", {type: "text", value: state.form.email}),
          p(state.formErrors.email),
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