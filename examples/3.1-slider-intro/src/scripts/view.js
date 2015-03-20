// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Slider = require("./slider");

// EXPORTS =========================================================================================
let View = Cycle.createView(Model => {
  let value$ = Model.get("value$");
  return {
    vtree$: value$.map(value => (
      <div class="everything">
        <div>
          <Slider value={value}/>
        </div>
      </div>
    )),
  };
});

module.exports = View;