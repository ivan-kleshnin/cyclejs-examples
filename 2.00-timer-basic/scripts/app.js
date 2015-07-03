import Cycle from "cyclejs";
let {Rx} = Cycle;
let Observable = Rx.Observable;

// APP =============================================================================================
function Model() {
  let started = Date.now();

  return {
    msSinceStart$: Observable.interval(100)
      .map(() => Date.now() - started)
  };
}

function View(state) {
  return state.msSinceStart$.map(msSinceStart => {
    let timeDelta = (msSinceStart / 1000).toFixed(1);
    return (
      <div>
        Started {timeDelta} seconds ago
      </div>
    );
  });
}

Cycle.applyToDOM("#app", () => View(Model()));
