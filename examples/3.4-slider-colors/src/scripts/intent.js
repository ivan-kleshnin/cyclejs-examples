// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Intent = Cycle.createIntent(DOM => {
  return {
    add$: DOM.event$(".sliders .add", "click").map(event => 1),
    remove$: DOM.event$(".slider", "remove").map(event => event.data)
      .tap(id => {
        console.log(`Intent gets remove(${id})!`);
      }),
    changeValue$: DOM.event$(".slider", "changeValue").map(event => event.data),
    changeColor$: DOM.event$(".slider", "changeColor").map(event => event.data),
  };
});

module.exports = Intent;