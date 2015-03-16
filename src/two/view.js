// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Footer = require("./footer");
let Item = require("./item");

// EXPORTS =========================================================================================
let View = Cycle.createView(Model => {
  let width$ = Model.get("width$");
  return {
    vtree$: width$.map(width => {
      return (
        <div class="everything">
          <div>
            {h("Item", {width: width})}
          </div>
          {h("Footer")}
        </div>
      );
    }),
  };
});

module.exports = View;