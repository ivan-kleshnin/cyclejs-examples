import Cycle from "cyclejs";
let {Rx} = Cycle;
let Observable = Rx.Observable;

// APP =============================================================================================
function Computer1() {
  return Observable.just(<div>App-1 rendered!</div>);
}

function Computer2() {
  return {
    vtree$: Observable.just(<div>App-2 rendered!</div>),
  };
}

Cycle.applyToDOM("#app-1", () => Computer1());
Cycle.applyToDOM("#app-2", () => Computer2());
