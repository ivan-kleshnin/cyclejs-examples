// IMPORTS =========================================================================================
let sortBy = require("lodash.sortby");
let values = require("lodash.values");
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Slider = require("./slider");

// EXPORTS =========================================================================================
let View = Cycle.createView(Model => {
  let state$ = Model.get("state$");
  return {
    vtree$: state$.map(models => (
      <div class="sliders">
        <div>
          {sortBy(values(models), model => model.id).map(model =>
            <Slider id={model.id} value={model.value} key={model.id}/>
          )}
        </div>
      </div>
    )),
  };
});

module.exports = View;