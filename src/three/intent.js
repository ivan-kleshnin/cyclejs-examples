// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Intent = Cycle.createIntent(DOM => {
  return {
    add$: DOM.event$(".add", "click").map(event => 1),

    remove$: DOM.event$(".item", "destroy").map(event => event.data),

    changeWidth$: DOM.event$(".item", "changeWidth").map(event => event.data),
  };
});

module.exports = Intent;