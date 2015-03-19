// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Slider = require("./slider");

// EXPORTS =========================================================================================
let View = Cycle.createView(Model => {
  let width$ = Model.get("width$");
  return {
    vtree$: width$.map(width => (
      <div class="everything">
        <div>
          <Slider width={width}/>
        </div>
      </div>
    )),
  };
});

module.exports = View;