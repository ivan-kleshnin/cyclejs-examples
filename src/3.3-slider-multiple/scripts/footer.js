// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("Footer", function(User) {
  let View = Cycle.createView(function() {
    return {
      vtree$: Rx.Observable.return(
        <div>=== footer ===</div>
      )
    };
  });

  User.inject(View);
});