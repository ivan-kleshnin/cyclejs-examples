import Cycle from "@cycle/core";
import CycleDOM from "@cycle/dom";

let {Rx} = Cycle;
let Observable = Rx.Observable;

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
      return (
        <div>
          Started {timeDelta} seconds ago
        </div>
      );
    })
  };
}

function main() {
  return view(model());
}

Cycle.run(main, {
  DOM: CycleDOM.makeDOMDriver("#app"),
});
