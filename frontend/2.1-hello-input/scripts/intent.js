// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Intent = Cycle.createIntent(User => {
  return {
    changeFirstName$: User.event$("#firstName", "input").map(event => event.target.value),
    changeLastName$: User.event$("#lastName", "input").map(event => event.target.value),
  };
});

module.exports = Intent;