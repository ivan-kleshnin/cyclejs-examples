let {assoc, identity, filter, values} = require("ramda")
let {Observable} = require("rx")
let {br, button, div, input, label, h1, p} = require("@cycle/dom")
let {always, flattenObject} = require("../helpers")
let {formatString, formatInteger} = require("../formatters")
let {derive, pluck, overState, storeUnion, toState, validate, view} = require("../rx.utils")
let {User} = require("../types")
let seeds = require("../seeds")
let {parseString, parseInteger} = require("../parsers")
let {makeUser} = require("../makers")
let menu = require("../chunks/menu")

let filterX = filter(identity)

let Username = User.meta.props.username
let Email = User.meta.props.email
let Points = User.meta.props.points
let Bonus = User.meta.props.bonus

module.exports = function ({navi, state, DOM}) {
  let textFrom = (s) => DOM.select(s).events("input")::pluck("target.value").map(parseString).share()
  let numberFrom = (s) => DOM.select(s).events("input")::pluck("target.value").map(parseInteger).share()
  let clickFrom = (s) => DOM.select(s).events("click").map((e) => true).share()
  
  let errors = {
    username: state::view("userCreateForm.username").skip(1)::validate(Username).startWith(null),
    email: state::view("userCreateForm.email").skip(1)::validate(Email).startWith(null),
    points: state::view("userCreateForm.points").skip(1)::validate(Points).startWith(null),
    bonus: state::view("userCreateForm.bonus").skip(1)::validate(Bonus).startWith(null),
  }

  let allErrors = storeUnion(errors)
  let hasErrors = derive((es) => Boolean(filterX(values(flattenObject(es))).length), [allErrors])

  let model = state::view("userCreateForm")
    .map((form) => {
      try {
        return makeUser(form)
      } catch (err) {
        if (err instanceof TypeError) { return null }
        else                          { throw err }
      }
    })
    .distinctUntilChanged().shareReplay(1)

  let intents = {
    changeUsername: textFrom("#username"),
    changeEmail: textFrom("#email"),
    changePoints: numberFrom("#points"),
    changeBonus: numberFrom("#bonus"),
    
    createUser: clickFrom("#submit").debounce(100),
  }
  
  let actions = {
    createUser: model.filter(identity)
      .sample(intents.createUser)
      .share(),
  }

  let update = Observable.merge(
    // Reset form on page enter
    Observable.of(seeds.userCreateForm)
      .sample(navi::view("route").delay(1))
      ::toState("userCreateForm"),

    // Track fields
    intents.changeUsername::toState("userCreateForm.username"),
    intents.changeEmail::toState("userCreateForm.email"),
    intents.changePoints::toState("userCreateForm.points"),
    intents.changeBonus::toState("userCreateForm.bonus"),

    // Create user
    actions.createUser::overState("users", (u) => assoc(u.id, u))
  )
  
  let redirect = Observable.merge(
    // Redirect to edit page after valid submit
    actions.createUser.delay(1).map((user) => window.unroute(`/users/:id`, {id: user.id}))
  )

  return {
    DOM: Observable.combineLatest(navi, state::view("userCreateForm"), allErrors, model)
      .debounce(1)
      .map(([navi, form, errors, model]) => {
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
    ),

    update,

    redirect,
  }
}

/*
Observation:
  extra DOM renders due to diamond case in dataflow

Comment:
  DOM stream can be also implemented as

  Observable.combineLatest(
   navi, state::view("userCreateForm").zip(formModel),
   (navi, [form, formModel]) => { ... }
  )

  1) To do it, data and derived data should be *strictly* synced (no .distinctUntilChanged(), no .debounce())
  2) due to 1) formModel will be recalculated much more often
  3) but DOM won't be rendered (and compared) twice after formModel is ready (not null)

  In other words: we can suppress extra DOM updates at the cost of more brittle architecture
  and more often formModel updates. I don't think it's worth it.

  Question: are there other working schemes I've overlooked?

  As far as I know, RxJS does not provide any solution against glitches yet... (Bacon does).
*/