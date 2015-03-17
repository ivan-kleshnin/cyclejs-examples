// IMPORTS =========================================================================================
let sortBy = require("lodash.sortby");
let values = require("lodash.values");
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Footer = require("./footer");
let Item = require("./item");

// EXPORTS =========================================================================================
let View = Cycle.createView(Model => {
  let state$ = Model.get("state$");
  return {
    vtree$: state$.map(models => {
      return (
        <div class="everything">
          <div class="topButtons">
            <button class="add">Add Random</button>
          </div>
          <div>
            {sortBy(values(models), model => model.id).map(model => {
              return h("Item.item", {id: model.id, width: model.width, color: model.color, key: model.id});
            })}
          </div>
          {h("Footer")}
        </div>
      );
    }),
  };
});

module.exports = View;