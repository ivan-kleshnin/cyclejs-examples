import DeepMerge from "deep-merge";
import {curry, keys, map, sortBy} from "ramda";

// HELPERS =========================================================================================
let doMerge = DeepMerge((a, b, key) => {
  return b;
});

let merge = curry((a, b) => {
  return doMerge(b, a);
});

let assign = curry((a, b) => {
  return Object.assign({}, b, a);
});

function toObject(array) {
  if (array instanceof Array) {
    return reduce((memo, item) => {
      return assoc(item.id, item, memo);
    }, {}, array);
  } else {
    throw Error(`array must be plain Array, got ${array}`);
  }
}

function toArray(object) {
  if (object instanceof Object) {
    return sortBy(
      item => item.id,
      map(key => object[key], keys(object))
    );
  } else {
    throw Error(`object must be a basic Object, got ${object}`);
  }
}

export default {
  merge, assign, toObject, toArray,
};
