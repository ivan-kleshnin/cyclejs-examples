// IMPORTS =========================================================================================
require("babel/polyfill");

// SHIMS ===========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

Cycle.latest = function (DataNode, keys, resultSelector) {
  let observables = keys.map(key => DataNode.get(key));
  let args = observables.concat([
    function selector(...list) {
      let item = keys.reduce((item, key) => {
        item[key.slice(0, -1)] = list[keys.indexOf(key)];
        return item;
      }, {});
      return resultSelector(item);
    }
  ]);
  return Rx.Observable.combineLatest.apply(null, args);
};

console.spy = function spy(...params) {
  return console.log.bind(console, ...params);
};