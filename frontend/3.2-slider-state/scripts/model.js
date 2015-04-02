// IMPORTS =========================================================================================
let range = require("lodash.range");
let UUID = require("node-uuid");
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Model = Cycle.createModel(Intent => {
  let changeValue$ = Intent.get("changeValue$").map(item => {
    return function transform(state) {
      state[item.id].value = item.value;
      return state;
    };
  });

  let transform$ = Rx.Observable.merge(
    changeValue$
  );

  return {
    state$: transform$
      .startWith(seedState())
      .scan((state, transform) => transform(state)),
  };
});

// HELPERS ========================================================================================
function seedState(n=undefined, max=2) {
  let n = n || Math.floor(Math.random() * max) + 1;
  let items = range(n).map(seedItem);
  return items.reduce((state, item) => {
    state[item.id] = item;
    return state;
  }, {});
}

function seedItem(withData) {
  return Object.assign({
    id: UUID.v4(),
    value: Math.floor(Math.random() * 100) + 1,
  }, withData);
}

module.exports = Model;