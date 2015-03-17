// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Intent = Cycle.createIntent(DOM => {
  return {
    changeFirstName$: DOM.event$("#firstName", "input").map(event => event.target.value),
    changeLastName$: DOM.event$("#lastName", "input").map(event => event.target.value),
  };
});

module.exports = Intent;