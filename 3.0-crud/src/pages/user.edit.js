let {assoc, filter, identity, merge, values} = require("ramda")
let {Observable: $} = require("rx")
let {br, button, div, input, label, h1, p} = require("@cycle/dom")

let {flattenObject} = require("../../../helpers")
let {derive, deriveN, pluck, setState, store, toOverState, toState, validate, view} = require("../../../rx.utils")
let {parseString, parseInteger} = require("../../../parsers")
let {formatString, formatInteger} = require("../../../formatters")

let {UserEdit} = require("../types")
let {makeUser} = require("../makers")
let seeds = require("../seeds/user.edit")
let menu = require("../chunks/menu")

let filterX = filter(identity)

let Points = UserEdit.meta.props.points
let Bonus = UserEdit.meta.props.bonus

// :: {Observable *} -> {Observable *}
module.exports = function (src) {
  let textFrom = (s) => src.DOM.select(s).events("input")::pluck("target.value").map(parseString).share()
  let numberFrom = (s) => src.DOM.select(s).events("input")::pluck("target.value").map(parseInteger).share()
  let clickFrom = (s) => src.DOM.select(s).events("click").map((e) => true).share()

  // DERIVED STATE
  let user = deriveN(
    (params, users) => users[params.id],
    [src.navi::view("params"), src.state::view("users")]
  )

  let model = deriveN((user, form) => {
    try {
      return makeUser(merge(user, form))
    } catch (err) {
      if (err instanceof TypeError) { return null }
      else                          { throw err }
    }
  }, [user, src.state2])

  let errors = store(seeds, $.merge(
    src.state2::view("points").skip(1)::validate(Points)::toState("points"),
    src.state2::view("bonus").skip(1)::validate(Bonus)::toState("bonus")
  ))

  let hasErrors = derive((es) => Boolean(filterX(values(flattenObject(es))).length), errors)

  // INTENTS
  let intents = {
    changePoints: numberFrom("#points"),
    changeBonus: numberFrom("#bonus"),

    editUser: clickFrom("#submit").debounce(100),
  }

  // ACTIONS
  let actions = {
    editUser: model.filter(identity)
      .sample(intents.editUser)
      .share(),
  }

  // STATE 2
  let state2 = store(seeds, $.merge(
    // Reset form on page enter
    user.sample(src.navi::view("route").delay(1)).map(UserEdit)::toState(""),

    // Track fields
    intents.changePoints::toState("points"),
    intents.changeBonus::toState("bonus")
  ))

  // DOM
  let DOM = $
    .combineLatest(src.navi, user, state2, model, errors).debounce(1)
    .map(([navi, user, form, model, errors]) => {
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
  )

  // UPDATE
  let update = $.merge(
    actions.editUser::toOverState("users", (u) => assoc(u.id, u))
  )

  // REDIRECT
  let redirect = $.merge(
    // Redirect to edit page after valid submit
    actions.editUser.delay(1).map((user) => window.unroute(`/users/:id`, {id: user.id}))
  )

  // SINKS
  return {DOM, update, redirect, state2}
}
