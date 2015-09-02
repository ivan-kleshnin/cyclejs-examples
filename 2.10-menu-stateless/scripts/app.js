import HH from "hyperscript-helpers";
import Cycle, {Rx} from "@cycle/core";
import CycleDOM, {h} from "@cycle/dom";
import Menu from "./menu";

let {div} = HH(h);
let {Observable} = Rx;

// APP =============================================================================================
let items = ["Home", "Services", "About", "Contact us"];
let active = "Services";

function main({DOM}) {
  let active$ = DOM.select(".menu").events("active")
    .map(event => event.detail);
  return {
  	DOM: active$.startWith(active).map(active => {
	    return div(
        h("app-menu", {items: items, active: active, key: "1"})
      );
	  }),
  }
}

Cycle.run(main, {
  DOM: CycleDOM.makeDOMDriver("#app", {
    "app-menu": Menu
  })
});
