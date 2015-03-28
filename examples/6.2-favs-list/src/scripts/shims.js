require("babel/polyfill");
let Cycle = require("cyclejs");
let {Rx} = Cycle;

Cycle.latest = function(DataNode, keys, resultSelector) {
  let observables = keys.map(key => DataNode.get(key));
  let args = observables.concat([
    function selector(...list) {
      let model = keys.reduce((model, key) => {
        model[key.slice(0, -1)] = list[keys.indexOf(key)];
        return model;
      }, {});
      return resultSelector(model);
    }
  ]);
  return Rx.Observable.combineLatest.apply(null, args);
};

console.spy = function spy(...params) {
  return console.log.bind(console, ...params);
};
