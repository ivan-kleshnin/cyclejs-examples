// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Intent = Cycle.createIntent(DOM => {
  return {
    changeQuery$: DOM.event$(".query", "input")
      .map(event => event.target.value.trim()),
  };
});

module.exports = Intent;