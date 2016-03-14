let {Observable} = require("rx")
let Cycle = require("@cycle/core")
let {div, h3, hr, label, input, makeDOMDriver} = require("@cycle/dom")

function main({DOM}) {
  let firstName$ = DOM.select("#first-name").events("input")
    .map(event => event.target.value)
    .startWith("")
  let lastName$ = DOM.select("#last-name").events("input")
    .map(event => event.target.value)
    .startWith("")
  return {
    DOM: Observable.combineLatest(
      firstName$, lastName$,
      function (firstName, lastName) {
        return div([
          div([
            label({htmlFor: "first-name"}, "First name: "),
            input("#first-name", {type: "text"}),
          ]),
          div([
            label({htmlFor: "last-name"}, "Last name: "),
            input("#last-name", {type: "text"}),
          ]),
          hr(),
          h3(`Hello ${firstName} ${lastName}`),
        ])
      }
    )
  }
}

Cycle.run(main, {
  DOM: makeDOMDriver("#app"),
})
