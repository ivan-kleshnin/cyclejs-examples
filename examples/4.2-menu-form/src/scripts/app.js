// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Menu = require("./menu");

// APP =============================================================================================
let data = [
  {name: "Web Development", price: 300},
  {name: "Design", price: 400},
  {name: "Integration", price: 250},
  {name: "Training", price: 220}
];

let active = ["Web Development", "Integration"];

let View = Cycle.createView(() => ({
  vtree$: Rx.Observable.return(
    <Menu items={data} active={active}/>
  ),
}));

Cycle.createDOMUser("main").inject(View);