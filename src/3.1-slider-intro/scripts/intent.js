// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Intent = Cycle.createIntent(DOM => {
  return {
    changeValue$: DOM.event$(".item", "changeValue").map(event => event.data),
  };
});

module.exports = Intent;