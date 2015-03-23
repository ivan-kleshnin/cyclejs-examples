// IMPORTS =========================================================================================
let uuid = require("node-uuid");
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Model = Cycle.createModel(Intent => {
  let add$ = Intent.get("add$").map(() => {
    return function transform(state) {
      let model = createRandom();
      let state = Object.assign({}, state);
      state[model.id] = model;
      return state;
    };
  });

  let remove$ = Intent.get("remove$").map(id => {
    return function transform(state) {
      let state = Object.assign({}, state);
      delete state[id];
      return state;
    };
  }).tap(function() {
    console.log("Model gets remove!");
  });

  let changeValue$ = Intent.get("changeValue$").map(model => {
    return function transform(state) {
      state[model.id].value = model.value;
      return state;
    };
  });

  let transforms = Rx.Observable.merge(
    add$,
    remove$,
    changeValue$
  );

  return {
    state$: transforms
      .startWith(seedState())
      .scan((state, transform) => {
        return transform(state);
      }),
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