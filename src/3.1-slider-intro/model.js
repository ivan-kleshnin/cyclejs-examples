// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Model = Cycle.createModel(Intent => {
  return {
    width$: Intent.get("changeWidth$").startWith(300),
  };
});

module.exports = Model;