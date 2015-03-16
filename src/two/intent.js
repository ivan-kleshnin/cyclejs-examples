// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Intent = Cycle.createIntent(DOM => {
  return {
    changeWidth$: DOM.event$(".item", "changeWidth").map(event => event.data),
  };
});

module.exports = Intent;