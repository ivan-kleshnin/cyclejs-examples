// IMPORTS =========================================================================================
require("./shims");
let Cycle = require("cyclejs");
let Model = require("./model");
let View = require("./view");
let Intent = require("./intent");

// APP =============================================================================================
let User = Cycle.createDOMUser("main");

User.inject(View).inject(Model).inject(Intent).inject(User);