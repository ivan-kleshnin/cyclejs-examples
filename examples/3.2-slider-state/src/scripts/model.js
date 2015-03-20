// IMPORTS =========================================================================================
let uuid = require("node-uuid");
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Model = Cycle.createModel(Intent => {
  let changeValue$ = Intent.get("changeValue$").map(model => {
    return function transform(state) {
      state[model.id].value = model.value;
      return state;
    };
  });

  let transforms = Rx.Observable.merge(
    changeValue$
  );

  return {
    state$: transforms
      .startWith(seedState())
      .scan((state, transform) => (
        transform(state)
      )),
  };
});

function createRandom(withData) {
  return Object.assign({
    id: uuid.v4(),
    value: Math.floor(Math.random() * 100) + 1,
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