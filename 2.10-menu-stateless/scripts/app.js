// IMPORTS =========================================================================================
import Cycle from "cyclejs";
import Menu from "./menu";
let {Rx} = Cycle;
let Observable = Rx.Observable;

// APP =============================================================================================
let items = ["Home", "Services", "About", "Contact us"];
let active = "Services";

function Computer(interactions) {
  let active$ = interactions.get(".menu", "active")
    .map(event => event.detail);
  return active$.startWith(active).map(active => {
    return (
      <div>
        <app-menu items={items} active={active} key="1"/>
      </div>
    );
  });
}

Cycle.registerCustomElement("app-menu", Menu);

Cycle.applyToDOM("#main", interactions => Computer(interactions));
