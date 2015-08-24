import Cycle from "@cycle/core";
import CycleDOM, {h} from "@cycle/dom";
import {makeIsomorphic} from "./middlewares";
import app from "./app";

let {Rx} = Cycle;
let {Observable} = Rx;

// APP =============================================================================================
Cycle.run(makeIsomorphic(app), {
  DOM: CycleDOM.makeDOMDriver("#app"),
  globals: () => Observable.return(window.globals)
});

