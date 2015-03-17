// IMPORTS =========================================================================================
let uuid = require("node-uuid");
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Model = Cycle.createModel(Intent => {
  let changeWidth$ = Intent.get("changeWidth$").map(model => {
    return function transform(state) {
      state[model.id].width = model.width;
      return state;
    };
  });

  let transforms = Rx.Observable.merge(
    changeWidth$
  );

  return {
    state$: transforms
      .startWith(seedState())
      .scan(function(state, transform) {
        return transform(state);
      })
  };
});

function createRandom(withData) {
  return Object.assign({
    id: uuid.v4(),
    width: Math.floor(Math.random() * 800 + 200),
  }, withData);
}

function seedState() {
  let model = createRandom();
  let state = {
    [model.id]: model,
  };
  return state;
}

module.exports = Model;