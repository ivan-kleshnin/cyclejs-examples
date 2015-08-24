import HH from "hyperscript-helpers";
import Cycle from "@cycle/core";
import CycleDOM, {h} from "@cycle/dom";

let {div} = HH(h);
let {Rx} = Cycle;
let {Observable} = Rx;

// APP =============================================================================================
function main1({DOM}) {
  return {
    DOM: Observable.return(div("App-1 rendered!"))
  };
}

function main2({DOM}) {
  return {
    DOM: Observable.return(div("App-2 rendered!")),
  };
}

Cycle.run(main1, {
  DOM: CycleDOM.makeDOMDriver("#app-1"),
});

Cycle.run(main2, {
  DOM: CycleDOM.makeDOMDriver("#app-2"),
});
