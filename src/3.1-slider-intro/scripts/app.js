require("./shims");

// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let Model = require("./model");
let View = require("./view");
let Intent = require("./intent");

// APP =============================================================================================
let DOM = Cycle.createDOMUser("main");

DOM.inject(View).inject(Model).inject(Intent).inject(DOM);