// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Intent = Cycle.createIntent(User => {
  return {
    add$: User.event$(".sliders .add", "click").map(event => 1),
    remove$: User.event$(".slider", "remove").map(event => event.data)
      .tap(id => {
        console.log(`Intent gets remove(${id})!`);
      }),
    changeValue$: User.event$(".slider", "changeValue").map(event => event.data),
    changeColor$: User.event$(".slider", "changeColor").map(event => event.data),
  };
});

module.exports = Intent;