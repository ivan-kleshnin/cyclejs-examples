import Cycle from "@cycle/core";
import CycleDOM from "@cycle/dom";
import Menu from "./menu";

let {Rx} = Cycle;
let Observable = Rx.Observable;

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
      <div>
        <app-menu items={items} active={active} key="1"/>
      </div>
    )
  }
}

Cycle.run(main, {
  DOM: CycleDOM.makeDOMDriver("#app", {
    "app-menu": Menu
  })
});
