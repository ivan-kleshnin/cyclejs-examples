import HH from "hyperscript-helpers";
import Cycle, {Rx} from "@cycle/core";
import CycleDOM, {h} from "@cycle/dom";

let {div, h3, hr, label, input} = HH(h);
let {Observable} = Rx;

// APP =============================================================================================
function main({DOM}) {
  let firstName$ = DOM.select("#first-name").events("input")
    .map(event => event.target.value)
    .startWith("");
  let lastName$ = DOM.select("#last-name").events("input")
    .map(event => event.target.value)
    .startWith("");
  return {
    DOM: Observable.combineLatest(
      firstName$, lastName$,
      function (firstName, lastName) {
        return div([
          div({className: "form-group"}, [
            label({htmlFor: "first-name"}, "First Name"),
            input({type: "text", className: "form-control", id: "first-name", placeholder: "First Name"}),
          ]),
          div({className: "form-group"}, [
            label({htmlFor: "first-name"}, "Last Name"),
            input({type: "text", className: "form-control", id: "last-name", placeholder: "Last Name"}),
          ]),
          hr(),
          h3(`Hello ${firstName} ${lastName}`),
        ]);
      }
    )
  };
}

Cycle.run(main, {
  DOM: CycleDOM.makeDOMDriver("#app"),
});
