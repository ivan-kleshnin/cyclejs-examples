let {assoc, identity} = require("ramda")
let {Observable} = require("rx")
let {br, button, div, input, label, h1, p} = require("@cycle/dom")
let {always} = require("../helpers")
let {formatString, formatInteger} = require("../formatters")
let {derive, pluck, overState, setState, toState, validateToState, view} = require("../rx.utils")
let {User} = require("../types")
let seeds = require("../seeds")
let {parseString, parseInteger} = require("../parsers")
let {draftUser, makeId} = require("../makers")
let menu = require("../chunks/menu")

module.exports = function ({navi, state, DOM}) {
  let textFrom = (s) => DOM.select(s).events("input")::pluck("target.value").map(parseString).share()
  let numberFrom = (s) => DOM.select(s).events("input")::pluck("target.value").map(parseInteger).share()
  let clickFrom = (s) => DOM.select(s).events("click").map((e) => true).share()
  
  let formModel = derive(
    [state::view("userCreateForm.data").debounce(100)],
    (data) => {
      try {
        return draftUser(data)
      } catch (err) {
        if (err instanceof TypeError) { return null }
        else                          { throw err }
      }
    }
  )
  
  let intents = {
    changeUsername: textFrom("#username"),
    changeEmail: textFrom("#email"),
    changePoints: numberFrom("#points"),
    changeBonus: numberFrom("#bonus"),
    
    createUser: clickFrom("#submit").debounce(100),
  }
  
  let actions = {
    createUser: formModel
      .sample(intents.createUser)
      .filter(identity)
      .map((u) => assoc("id", makeId(), u))
      .share(),
  }

  let Username = User.meta.props.username
  let Email = User.meta.props.email
  let Points = User.meta.props.points
  let Bonus = User.meta.props.bonus

  let update = Observable.merge(
    // TODO intents.createUser <- validate form

    // Reset form on page enter
    navi::view("route")::setState("userCreateForm", always(seeds.userCreateForm)),

    // Reset form after valid submit
    actions.createUser.delay(1)::setState("userCreateForm", always(seeds.userCreateForm)),

    // Track fields
    intents.changeUsername::toState("userCreateForm.data.username"),
    intents.changeUsername::validateToState("userCreateForm.errors.username", Username),

    intents.changeEmail::toState("userCreateForm.data.email"),
    intents.changeEmail::validateToState("userCreateForm.errors.email", Email),

    intents.changePoints::toState("userCreateForm.data.points"),
    intents.changePoints::validateToState("userCreateForm.errors.points", Points),

    intents.changeBonus::toState("userCreateForm.data.bonus"),
    intents.changeBonus::validateToState("userCreateForm.errors.bonus", Bonus),

    // Create user
    actions.createUser::overState("users", (u) => assoc(u.id, u))
  )

  let redirect = Observable.merge(
    // Redirect to edit page after valid submit
    actions.createUser.delay(1).map((user) => window.unroute(`/users/:id`, {id: user.id}))
  )
  
  return {
    DOM: formModel.withLatestFrom(
      navi, state::view("userCreateForm"),
      (formModel, navi, form) => {
        console.log("render user.create")
        return div([
          h1("Create User"),
          menu({navi}),
          br(),
          div(".form-element", [
            label({htmlFor: "username"}, "Username:"),
            br(),
            input("#username", {type: "text", value: formatString(form.data.username), autocomplete: "off"}),
            p(form.errors.username),
          ]),
          div(".form-element", [
            label({htmlFor: "email"}, "Email:"),
            br(),
            input("#email", {type: "text", value: formatString(form.data.email), autocomplete: "off"}),
            p(form.errors.email),
          ]),
          div(".form-element", [
            label({htmlFor: "points"}, "Points:"),
            br(),
            input("#points", {type: "text", value: formatInteger(form.data.points), autocomplete: "off"}),
            p(form.errors.points),
          ]),
          div(".form-element", [
            label({htmlFor: "bonus"}, "Bonus:"),
            br(),
            input("#bonus", {type: "text", value: formatInteger(form.data.bonus), autocomplete: "off"}),
            p(form.errors.bonus),
          ]),
          button("#submit.form-element", {type: "submit", disabled: !formModel}, "Create"),
        ])
      }
    ),

    update,

    redirect,
  }
}