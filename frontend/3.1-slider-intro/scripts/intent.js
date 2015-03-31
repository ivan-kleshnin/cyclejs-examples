// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Intent = Cycle.createIntent(User => {
  return {
    changeValue$: User.event$(".item", "changeValue").map(event => event.data),
  };
});

module.exports = Intent;