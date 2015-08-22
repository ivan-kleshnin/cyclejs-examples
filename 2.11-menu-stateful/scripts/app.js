import Cycle from "@cycle/core";
import CycleDOM, {h} from "@cycle/dom";
import HH from "hyperscript-helpers";
import Menu from "./menu";

let {div} = HH(h);
let {Rx} = Cycle;
let {Observable} = Rx;

// APP =============================================================================================
let items = ["Home", "Services", "About", "Contact us"];
let active = "Services";

function main({DOM}) {
  DOM.get(".menu", "active")
    .map(data => data.detail)
    .subscribe(active => {
      console.log("active:", active);
    });
  return {
    DOM: Observable.return(
      div(
        h("app-menu", {items: items, active: active, key: "1"})
      )
    ),
  }
}

Cycle.run(main, {
  DOM: CycleDOM.makeDOMDriver("#app", {
    "app-menu": Menu
  })
});
