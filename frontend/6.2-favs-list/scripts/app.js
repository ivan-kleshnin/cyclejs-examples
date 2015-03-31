// IMPORTS =========================================================================================
require("../../common/scripts/shims");
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Pictures = require("./pictures");
let Picture = require("./picture");
let Model = require("./model");
let View = require("./view");
let Intent = require("./intent");

// APP =============================================================================================
let User = Cycle.createDOMUser("main");

User.inject(View).inject(Model).inject(Intent).inject(User);

// Not supported yet!
//User.event$("Picture", "click").subscribe(...);
//User.event$("Picture", "favup").subscribe(...);
//User.event$("Picture", "unfav").subscribe(...);