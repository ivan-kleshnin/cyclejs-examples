import Cycle from "@cycle/core";
import CycleWeb from "@cycle/web";

let {Rx} = Cycle;
let Observable = Rx.Observable;

// APP =============================================================================================
function main1({DOM}) {
  return {
    DOM: Observable.just(<div>App-1 rendered!</div>)
  };
}

function main2({DOM}) {
  return {
    DOM: Observable.just(<div>App-2 rendered!</div>),
  };
}

Cycle.run(main1, {
  DOM: CycleWeb.makeDOMDriver("#app-1"),
});

Cycle.run(main2, {
  DOM: CycleWeb.makeDOMDriver("#app-2"),
});
