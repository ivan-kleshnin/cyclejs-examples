// IMPORTS =========================================================================================
import Cycle from "cyclejs";
import Menu from "./menu";
let {Rx} = Cycle;
let Observable = Rx.Observable;

// APP =============================================================================================
let items = ["Home", "Services", "About", "Contact us"];
let active = "Services";

function Computer(interactions) {
  interactions.get(".menu", "active")
    .map(data => data.detail)
    .subscribe(active => {
      console.log("active:", active);
    });
  return Observable.return(
    <div>
      <app-menu items={items} active={active} key="1"/>
    </div>
  );
}

Cycle.registerCustomElement("app-menu", Menu);

Cycle.applyToDOM("#main", interactions => Computer(interactions));
