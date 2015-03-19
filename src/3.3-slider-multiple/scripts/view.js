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
      <div class="everything">
        <div class="topButtons">
          <button class="add">Add Random</button>
        </div>
        <div>
          {sortBy(values(models), model => model.id).map(model =>
            <Slider id={model.id} width={model.width} key={model.id}/>
          )}
        </div>
      </div>
    )),
  };
});

module.exports = View;