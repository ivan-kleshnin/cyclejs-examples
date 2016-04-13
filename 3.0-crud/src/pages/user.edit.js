let {assoc, identity, filter, merge, values} = require("ramda")
let {Observable} = require("rx")
let {br, button, div, input, label, h1, p} = require("@cycle/dom")
let {always, flattenObject} = require("../helpers")
let {formatString, formatInteger} = require("../formatters")
let {derive, pluck, overState, storeUnion, toState, validate, view} = require("../rx.utils")
let {UserEdit} = require("../types")
let seeds = require("../seeds")
let {parseString, parseInteger} = require("../parsers")
let {makeUser} = require("../makers")
let menu = require("../chunks/menu")

let filterX = filter(identity)

let Points = UserEdit.meta.props.points
let Bonus = UserEdit.meta.props.bonus

module.exports = function ({navi, state, DOM}) {
  let textFrom = (s) => DOM.select(s).events("input")::pluck("target.value").map(parseString).share()
  let numberFrom = (s) => DOM.select(s).events("input")::pluck("target.value").map(parseInteger).share()
  let clickFrom = (s) => DOM.select(s).events("click").map((e) => true).share()
  
  let user = derive(
    (params, users) => users[params.id],
    [navi::view("params"), state::view("users")]
  )

  let errors = {
    points: state::view("userEditForm.points").skip(2)::validate(Points).startWith(null),
    bonus: state::view("userEditForm.bonus").skip(2)::validate(Bonus).startWith(null),
  }

  let allErrors = storeUnion(errors)
  let hasErrors = derive((es) => Boolean(filterX(values(flattenObject(es))).length), [allErrors])

  let model = state::view("userEditForm")
    .combineLatest(user, (form, user) => {
      try {
        return makeUser(merge(user, form))
      } catch (err) {
        if (err instanceof TypeError) { return null }
        else                          { throw err }
      }
    })
    .distinctUntilChanged().shareReplay(1)

  let intents = {
    changePoints: numberFrom("#points"),
    changeBonus: numberFrom("#bonus"),
    
    editUser: clickFrom("#submit").debounce(100),
  }
  
  let actions = {
    editUser: model.filter(identity)
      .sample(intents.editUser)
      .share(),
  }

  let update = Observable.merge(
    // Reset form on page enter
    user
      .sample(navi::view("route").delay(1))
      .map(UserEdit)
      ::toState("userEditForm"),

    // Track fields
    intents.changePoints::toState("userEditForm.points"),
    intents.changeBonus::toState("userEditForm.bonus"),

    // Edit user
    actions.editUser::overState("users", (u) => assoc(u.id, u))
  )
  
  let redirect = Observable.merge(
    // Redirect to edit page after valid submit
    actions.editUser.delay(1).map((user) => window.unroute(`/users/:id`, {id: user.id}))
  )

  return {
    DOM: Observable.combineLatest(navi, user, state::view("userEditForm"), allErrors, model)
      .debounce(1)
      .map(([navi, user, form, errors, model]) => {
        console.log("render user.edit")

        return div([
          h1("Edit User"),
          menu({navi}),
          br(),
          div(".form-element", [
            label({htmlFor: "username"}, "Username:"),
            br(),
            input("#username", {type: "text", value: formatString(user.username), readOnly: true}),
            p(errors.username),
          ]),
          div(".form-element", [
            label({htmlFor: "email"}, "Email:"),
            br(),
            input("#email", {type: "text", value: formatString(user.email), readOnly: true}),
            p(errors.email),
          ]),
          div(".form-element", [
            label({htmlFor: "points"}, "Points:"),
            br(),
            input("#points", {type: "text", value: formatInteger(form.points), autocomplete: "off"}),
            p(errors.points),
          ]),
          div(".form-element", [
            label({htmlFor: "bonus"}, "Bonus:"),
            br(),
            input("#bonus", {type: "text", value: formatInteger(form.bonus), autocomplete: "off"}),
            p(errors.bonus),
          ]),
          button("#submit.form-element", {type: "submit", disabled: !model}, "Edit"),
        ])
      }
    ),

    update,

    redirect,
  }
}