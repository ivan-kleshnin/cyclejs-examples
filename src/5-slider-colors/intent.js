// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Intent = Cycle.createIntent(DOM => {
  return {
    add$: DOM.event$(".add", "click").map(event => 1),
    remove$: DOM.event$(".item", "remove").map(event => event.data),
    changeWidth$: DOM.event$(".item", "changeWidth").map(event => event.data),
    changeColor$: DOM.event$(".item", "changeColor").map(event => event.data),
  };
});

module.exports = Intent;