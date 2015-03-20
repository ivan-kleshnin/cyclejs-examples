// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// APP =============================================================================================
let Model = Cycle.createModel(() => {
  let started = Date.now();
  return {
    msSinceStart$: Rx.Observable.interval(100)
      .map(() => Date.now() - started)
  };
});

let View = Cycle.createView(Model => {
  return {
    vtree$: Model.get("msSinceStart$").map(msSinceStart => {
      let timeDelta = (msSinceStart / 1000).toFixed(1);
      return (
        <div>
          Started {timeDelta} seconds ago
        </div>
      );
    }),
  };
});

let User = Cycle.createDOMUser("main");

User.inject(View).inject(Model);