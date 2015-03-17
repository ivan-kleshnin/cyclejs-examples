// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// APP =============================================================================================
let Model = Cycle.createModel(() => {
  let started = Date.now();
  return {
    msSinceStart$: Rx.Observable.interval(100).map(() => {
      return Date.now() - started;
    }),
  };
});

let View = Cycle.createView(Model => {
  return {
    vtree$: Model.get("msSinceStart$").map(msSinceStart => {
      let delta = (msSinceStart / 1000).toFixed(1);
      return <p>Started {delta} seconds ago</p>;
    }),
  };
});

Cycle.createDOMUser("main").inject(View).inject(Model);