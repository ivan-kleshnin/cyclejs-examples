let {assoc, filter, identity, values} = require("ramda")
let {Observable: $} = require("rx")
let {br, button, div, input, label, h1, p} = require("@cycle/dom")

let {flattenObject} = require("../../../helpers")
let {derive, pluck, setState, store, toOverState, toState, validate, view} = require("../../../rx.utils")
let {parseString, parseInteger} = require("../../../parsers")
let {formatString, formatInteger} = require("../../../formatters")

let {User} = require("../types")
let {makeUser} = require("../makers")
let seeds = require("../seeds/user.create")
let menu = require("../chunks/menu")

let filterX = filter(identity)

let Username = User.meta.props.username
let Email = User.meta.props.email
let Points = User.meta.props.points
let Bonus = User.meta.props.bonus

// :: {Observable *} -> {Observable *}
module.exports = function (src) {
  // STATE 2
  let state2 = store(seeds, src.update2)

  // DERIVED STATE 2
  let model = derive((form) => {
    try {
      return makeUser(form)
    } catch (err) {
      if (err instanceof TypeError) { return null }
      else                          { throw err }
    }
  }, state2)

  let errors = store(seeds, $.merge(
    state2::view("username").skip(1)::validate(Username)::toState("username"),
    state2::view("email").skip(1)::validate(Email)::toState("email"),
    state2::view("points").skip(1)::validate(Points)::toState("points"),
    state2::view("bonus").skip(1)::validate(Bonus)::toState("bonus")
  ))

  let hasErrors = derive((es) => Boolean(filterX(values(flattenObject(es))).length), errors)

  // INTENTS
  let textFrom = (s) => src.DOM.select(s).events("input")::pluck("target.value").map(parseString).share()
  let numberFrom = (s) => src.DOM.select(s).events("input")::pluck("target.value").map(parseInteger).share()
  let clickFrom = (s) => src.DOM.select(s).events("click").map((e) => true).share()

  let intents = {
    changeUsername: textFrom("#username"),
    changeEmail: textFrom("#email"),
    changePoints: numberFrom("#points"),
    changeBonus: numberFrom("#bonus"),

    createUser: clickFrom("#submit").debounce(100),
  }

  // ACTIONS
  let actions = {
    createUser: model.filter(identity)
      .sample(intents.createUser)
      .share(),
  }

  // UPDATE
  let update = $.merge(
    // Apply action
    actions.createUser::toOverState("users", (u) => assoc(u.id, u)),
    
    // Redirect to detail view after action
    actions.createUser.delay(1).map((user) => window.unroute(`/users/:id`, {id: user.id}))::toState("url")
  )

  // UPDATE 2
  let update2 = $.merge(
    // Reset form on page enter
    src.navi::view("route")::setState("", seeds),

    // Track fields
    intents.changeUsername::toState("username"),
    intents.changeEmail::toState("email"),
    intents.changePoints::toState("points"),
    intents.changeBonus::toState("bonus")
  )

  // DOM
  let DOM = $
    .combineLatest(src.navi, state2, model, errors).debounce(1)
    .map(([navi, form, model, errors]) => {
      console.log("render user.create")

      return div([
        h1("Create User"),
        menu({navi}),
        br(),
        div(".form-element", [
          label({htmlFor: "username"}, "Username:"),
          br(),
          input("#username", {type: "text", value: formatString(form.username), autocomplete: "off"}),
          p(errors.username),
        ]),
        div(".form-element", [
          label({htmlFor: "email"}, "Email:"),
          br(),
          input("#email", {type: "text", value: formatString(form.email), autocomplete: "off"}),
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
        button("#submit.form-element", {type: "submit", disabled: !model}, "Create"),
      ])
    }
  )

  // SINKS
  return {DOM, update, update2}
}
