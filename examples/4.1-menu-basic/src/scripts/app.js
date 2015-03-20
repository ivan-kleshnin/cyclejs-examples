// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Menu = require("./menu");

// APP =============================================================================================
let data = [
  "Home", "Services", "About", "Contact us"
];

let active = "Services";

let View = Cycle.createView(() => ({
  vtree$: Rx.Observable.return(
    <Menu items={data} active={active}/>
  ),
}));

Cycle.createDOMUser("main").inject(View);