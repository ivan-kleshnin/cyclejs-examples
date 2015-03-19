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
        <label>First Name:</label>
        <input type="text" id="firstName"/>

        <label>Last Name:</label>
        <input type="text" id="lastName"/>

        <h1>Hello {firstName + " " + lastName}</h1>
        <Footer class="xxx"/>
      </div>
    )),
  };
});

module.exports = View;

