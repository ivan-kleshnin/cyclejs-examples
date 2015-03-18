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
  });

  let changeWidth$ = Intent.get("changeWidth$").map(model => {
    return function transform(state) {
      state[model.id].width = model.width;
      return state;
    };
  });

  let changeColor$ = Intent.get("changeColor$").map(model => {
    return function(state) {
      state[model.id].color = model.color;
      return state;
    };
  });

  let transforms = Rx.Observable.merge(
    add$,
    remove$,
    changeColor$,
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
    color: '#' + Math.random().toString(16).substr(-6),
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