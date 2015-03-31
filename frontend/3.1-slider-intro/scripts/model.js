// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Model = Cycle.createModel(Intent => {
  return {
    value$: Intent.get("changeValue$").startWith(Math.floor(Math.random() * 100) + 1),
  };
});

module.exports = Model;