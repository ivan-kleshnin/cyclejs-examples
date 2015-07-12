import Cycle from "@cycle/core";
import CycleWeb from "@cycle/web";

let {Rx} = Cycle;
let Observable = Rx.Observable;

// APP =============================================================================================
function main({DOM}) {
  let firstName$ = DOM.get("#first-name", "input")
    .map(event => event.target.value)
    .startWith("");
  let lastName$ = DOM.get("#last-name", "input")
    .map(event => event.target.value)
    .startWith("");
  return {
    DOM: Observable.combineLatest(
      firstName$, lastName$,
      function (firstName, lastName) {
        return (
          <div>
            <div className="form-group">
              <label htmlFor="first-name">First Name:</label>
              <input type="text" className="form-control" id="first-name" placeholder="First Name"/>
            </div>
            <div className="form-group">
              <label htmlFor="last-name">Last Name:</label>
              <input type="text" className="form-control" id="last-name" placeholder="Last Name"/>
            </div>
            <hr/>
            <h3>Hello {firstName} {lastName}</h3>
          </div>
        );
      })
  };
}

Cycle.run(main, {
  DOM: CycleWeb.makeDOMDriver("#app"),
});
