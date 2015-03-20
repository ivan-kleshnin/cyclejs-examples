// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Footer = require("./footer");

// EXPORTS =========================================================================================
let View = Cycle.createView(Model => {
  let firstName$ = Model.get("firstName$");
  let lastName$ = Model.get("lastName$");
  return {
    vtree$: Rx.Observable.combineLatest(firstName$, lastName$, (firstName, lastName) => (
      <div>
        <div class="form-group">
          <label>First Name:</label>
          <input type="text" class="form-control" id="firstName" placeholder="First Name"/>
        </div>

        <div class="form-group">
          <label>Last Name:</label>
          <input type="text" class="form-control" id="lastName" placeholder="Last Name"/>
        </div>

        <h1>Hello {firstName + " " + lastName}!</h1>
        <Footer class="xxx"/>
      </div>
    )),
  };
});

module.exports = View;

