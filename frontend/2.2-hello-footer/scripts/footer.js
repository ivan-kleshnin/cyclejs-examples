// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// ELEMENTS ========================================================================================
export default Cycle.registerCustomElement("Footer", User => {
  let View = Cycle.createView(() => ({
    vtree$: Rx.Observable.return(
      <div>=== footer ===</div>
    )
  }));

  User.inject(View);
});