// IMPORTS =========================================================================================
require("../../common/scripts/shims");
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Picture = require("./picture");
let View = require("./view");

// APP =============================================================================================
let User = Cycle.createDOMUser("main");

User.inject(View);

User.event$(".picture", "favup").subscribe(event => {
  console.log("Favup:", event.data);
});

User.event$(".picture", "unfav").subscribe(event => {
  console.log("Unfav:", event.data);
});

// Not supported yet!
//User.event$("Picture", "favup").subscribe(...);
//User.event$("Picture", "unfav").subscribe(...);



