// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("footer", User => {
  let View = Cycle.createView(() => {
    return {
      vtree$: Rx.Observable.return(
        <div>=== footer ===</div>
      )
    };
  });

  User.inject(View);
});