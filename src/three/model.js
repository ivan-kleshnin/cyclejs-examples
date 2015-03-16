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
    console.log(">>>", model);
    return function transform(state) {
      state[model.id].width = model.width;
      return state;
    };
  });

  let transforms = Rx.Observable.merge(
    add$,
    remove$,
    changeWidth$
  );

  return {
    state$: transforms
      .startWith([createRandom()])
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

module.exports = Model;