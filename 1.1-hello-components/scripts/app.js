import Cycle from "cyclejs";
let {Rx} = Cycle;
let Observable = Rx.Observable;

// APP =============================================================================================
function Computer(interactions) {
  let firstName$ = interactions.get("#first-name", "input")
    .map(event => event.target.value)
    .startWith("");
  let lastName$ = interactions.get("#last-name", "input")
    .map(event => event.target.value)
    .startWith("");
  return Observable.combineLatest(
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
          <app-footer key="1"/>
        </div>
      );
    });
}

function Footer(interactions, props) {
  return {
    vtree$: Observable.return(
      <div>=== footer ===</div>
    )
  };
}

Cycle.registerCustomElement("app-footer", Footer);

Cycle.applyToDOM("#app", Computer);
