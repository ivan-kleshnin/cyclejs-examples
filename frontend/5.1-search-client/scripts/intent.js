// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Intent = Cycle.createIntent(User => {
  return {
    changeQuery$: User.event$(".query", "input")
      .map(event => event.target.value.trim()),
  };
});

module.exports = Intent;