let {assoc, identity, merge} = require("ramda")
let {Observable} = require("rx")
let {br, button, div, input, label, h1, p} = require("@cycle/dom")
let {always} = require("../helpers")
let {formatString, formatInteger} = require("../formatters")
let {derive, pluck, overState, setState, toState, validateToState, view} = require("../rx.utils")
let {User, UserEdit} = require("../types")
let seeds = require("../seeds")
let {parseString, parseInteger} = require("../parsers")
let {draftUser} = require("../makers")
let menu = require("../chunks/menu")

module.exports = function ({navi, state, DOM}) {
  let textFrom = (s) => DOM.select(s).events("input")::pluck("target.value").map(parseString).share()
  let numberFrom = (s) => DOM.select(s).events("input")::pluck("target.value").map(parseInteger).share()
  let clickFrom = (s) => DOM.select(s).events("click").map((e) => true).share()
  
  let user = derive(
    [navi::view("params"), state::view("users")], 
    (params, users) => users[params.id]
  )
  
  let formModel = derive(
    [user, state::view("userEditForm.data").debounce(100)],
    (user, data) => {
      try {
        return draftUser(merge(user, data))
      } catch (err) {
        if (err instanceof TypeError) { return null }
        else                          { throw err }
      }
    }
  )
  
  let intents = {
    changePoints: numberFrom("#points"),
    changeBonus: numberFrom("#bonus"),
    
    editUser: clickFrom("#submit").debounce(100),
  }
  
  let actions = {
    editUser: formModel
      .sample(intents.editUser)
      .filter(identity)
      .share(),
  }

  let Points = UserEdit.meta.props.points
  let Bonus = UserEdit.meta.props.bonus

  let update = Observable.merge(
    // TODO intents.editUser <- validate form

    // Reset form on page enter
    user.sample(state::view("route"))
      .map(UserEdit)
      ::toState("userEditForm.data"),

    // Reset form.errors after valid submit
    actions.editUser.delay(1)::setState("userEditForm.errors", always(seeds.userEditForm.errors)),

    // Track fields
    intents.changePoints::toState("userEditForm.data.points"),
    intents.changePoints::validateToState("userEditForm.errors.points", Points),

    intents.changeBonus::toState("userEditForm.data.bonus"),
    intents.changeBonus::validateToState("userEditForm.errors.bonus", Bonus),

    // Edit user
    actions.editUser::overState("users", (u) => assoc(u.id, u))
  )
  
  return {
    DOM: Observable.combineLatest(
      navi, state::view("userEditForm"), user, formModel,
      (navi, form, user, formModel) => {
        console.log("render user.edit")
        return div([
          h1("Edit User"),
          menu({navi}),
          br(),
          div(".form-element", [
            label({htmlFor: "username"}, "Username:"),
            br(),
            input("#username", {type: "text", value: formatString(user.username), readOnly: true}),
            p(form.errors.username),
          ]),
          div(".form-element", [
            label({htmlFor: "email"}, "Email:"),
            br(),
            input("#email", {type: "text", value: formatString(user.email), readOnly: true}),
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
          button("#submit.form-element", {type: "submit", disabled: !formModel}, "Edit"),
        ])
      }
    ),

    update,
  }
}