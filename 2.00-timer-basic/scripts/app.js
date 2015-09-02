import HH from "hyperscript-helpers";
import Cycle, {Rx} from "@cycle/core";
import CycleDOM, {h} from "@cycle/dom";

let {div} = HH(h);
let {Observable} = Rx;

// APP =============================================================================================
function model() {
  let started = Date.now();

  return {
    msSinceStart$: Observable.interval(100)
      .map(() => Date.now() - started)
  };
}

function view(state) {
  return {
    DOM: state.msSinceStart$.map(msSinceStart => {
      let timeDelta = (msSinceStart / 1000).toFixed(1);
      return div(`Started ${timeDelta} seconds ago`);
    })
  };
}

function main() {
  return view(model());
}

Cycle.run(main, {
  DOM: CycleDOM.makeDOMDriver("#app"),
});
