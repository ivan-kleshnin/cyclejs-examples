// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Model = Cycle.createModel(Intent => {
  return {
    firstName$: Intent.get("changeFirstName$").startWith(""),
    lastName$: Intent.get("changeLastName$").startWith(""),
  };
});

module.exports = Model;