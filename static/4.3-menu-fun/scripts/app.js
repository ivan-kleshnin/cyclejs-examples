(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("../../common/scripts/shims");
var range = require("lodash.range");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var Menu = require("./menu");

// APP =============================================================================================
var data = [{ name: "Web Development", price: 300 }, { name: "Design", price: 400 }, { name: "Integration", price: 250 }, { name: "Training", price: 220 }];

var active = ["Web Development", "Integration"];

function randomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomActive(data) {
  var names = data.map(function (item) {
    return item.name;
  });
  var randomCount = randomInt(names.length - 1);
  var randomItems = range(randomCount).map(function () {
    return randomFrom(names);
  });
  return Array.from(new Set(randomItems));
}

var Model = Cycle.createModel(function () {
  return {
    active$: Rx.Observable.interval(2000).map(function () {
      return generateRandomActive(data);
    }) };
});

var View = Cycle.createView(function (Model) {
  return {
    vtree$: Model.get("active$").map(function (active) {
      return h("div", null, [h("Menu", { items: data, active: active })]);
    }) };
});

Cycle.createDOMUser("main").inject(View).inject(Model);

},{"../../common/scripts/shims":3,"./menu":2,"cyclejs":"cyclejs","lodash.range":4}],2:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var makeClass = require("classnames");

// COMPONENTS ======================================================================================
Cycle.registerCustomElement("Menu", function (User, Props) {
  var Model = Cycle.createModel(function (Intent, Props) {
    return {
      items$: Props.get("items$").startWith([]),
      active$: Props.get("active$").merge(Intent.get("selectOrUnselect$").map(function (name) {
        return [name];
      })).startWith([]).scan(function (state, names) {
        return names.reduce(function (state, name) {
          if (name) {
            if (state.indexOf(name) == -1) {
              // Select
              return state.concat([name]);
            } else {
              // Unselect
              return state.filter(function (n) {
                return n != name;
              });
            }
          } else {
            // Keep current
            return state;
          }
        }, state);
      }) };
  });

  var View = Cycle.createView(function (Model) {
    var items$ = Model.get("items$");
    var active$ = Model.get("active$");
    return {
      vtree$: items$.combineLatest(active$, function (items, active) {
        var totalPrice = items.filter(function (item) {
          return active.indexOf(item.name) != -1;
        }).reduce(function (sum, item) {
          return sum + item.price;
        }, 0);
        return h("div", null, [h("nav", null, [items.map(function (item) {
          return h("div", { attributes: { "data-name": item.name }, key: item.name,
            className: makeClass({ item: true, active: active.indexOf(item.name) != -1 }) }, [item.name, " ", h("b", null, ["$", item.price.toFixed(2)])]);
        }), h("div", null, ["Total: ", h("b", null, ["$", totalPrice.toFixed(2)])])])]);
      }) };
  });

  var Intent = Cycle.createIntent(function (User) {
    return {
      selectOrUnselect$: User.event$("nav .item", "click").map(function (event) {
        return event.currentTarget.dataset.name;
      }) };
  });

  User.inject(View).inject(Model).inject(Intent, Props)[0].inject(User);
});

// TODO https://github.com/alexmingoia/jsx-transform/issues/15

},{"classnames":"classnames","cyclejs":"cyclejs"}],3:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("babel/polyfill");

// SHIMS ===========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

Cycle.latest = function (DataNode, keys, resultSelector) {
  var observables = keys.map(function (key) {
    return DataNode.get(key);
  });
  var args = observables.concat([function selector() {
    for (var _len = arguments.length, list = Array(_len), _key = 0; _key < _len; _key++) {
      list[_key] = arguments[_key];
    }

    var item = keys.reduce(function (item, key) {
      item[key.slice(0, -1)] = list[keys.indexOf(key)];
      return item;
    }, {});
    return resultSelector(item);
  }]);
  return Rx.Observable.combineLatest.apply(null, args);
};

console.spy = function spy() {
  var _console$log;

  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  return (_console$log = console.log).bind.apply(_console$log, [console].concat(params));
};

},{"babel/polyfill":"babel/polyfill","cyclejs":"cyclejs"}],4:[function(require,module,exports){
/**
 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isIterateeCall = require('lodash._isiterateecall');

/** Native method references. */
var ceil = Math.ceil;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`. If `start` is less than `end` a
 * zero-length range is created unless a negative `step` is specified.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @param {number} [step=1] The value to increment or decrement by.
 * @returns {Array} Returns the new array of numbers.
 * @example
 *
 * _.range(4);
 * // => [0, 1, 2, 3]
 *
 * _.range(1, 5);
 * // => [1, 2, 3, 4]
 *
 * _.range(0, 20, 5);
 * // => [0, 5, 10, 15]
 *
 * _.range(0, -4, -1);
 * // => [0, -1, -2, -3]
 *
 * _.range(1, 4, 0);
 * // => [1, 1, 1]
 *
 * _.range(0);
 * // => []
 */
function range(start, end, step) {
  if (step && isIterateeCall(start, end, step)) {
    end = step = null;
  }
  start = +start || 0;
  step = step == null ? 1 : (+step || 0);

  if (end == null) {
    end = start;
    start = 0;
  } else {
    end = +end || 0;
  }
  // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
  // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
  var index = -1,
      length = nativeMax(ceil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (++index < length) {
    result[index] = start;
    start += step;
  }
  return result;
}

module.exports = range;

},{"lodash._isiterateecall":5}],5:[function(require,module,exports){
/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Used as the maximum length of an array-like value.
 * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * for more details.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = +value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number') {
    var length = object.length,
        prereq = isLength(length) && isIndex(index, length);
  } else {
    prereq = type == 'string' && index in object;
  }
  if (prereq) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on ES `ToLength`. See the
 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
 * for more details.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the language type of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * **Note:** See the [ES5 spec](https://es5.github.io/#x8) for more details.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (value && type == 'object') || false;
}

module.exports = isIterateeCall;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC80LjMtbWVudS1mdW4vc2NyaXB0cy9hcHAuanMiLCJidWlsZC80LjMtbWVudS1mdW4vc2NyaXB0cy9tZW51LmpzIiwiYnVpbGQvY29tbW9uL3NjcmlwdHMvc2hpbXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLnJhbmdlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5yYW5nZS9ub2RlX21vZHVsZXMvbG9kYXNoLl9pc2l0ZXJhdGVlY2FsbC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0NBLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3RDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUIsRUFBRSxHQUFPLEtBQUssQ0FBZCxFQUFFO0lBQUUsQ0FBQyxHQUFJLEtBQUssQ0FBVixDQUFDOztBQUNWLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBRzdCLElBQUksSUFBSSxHQUFHLENBQ1QsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxFQUNyQyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxFQUM1QixFQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxFQUNqQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUMvQixDQUFDOztBQUVGLElBQUksTUFBTSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsYUFBYSxDQUFDLENBQUM7O0FBRWhELFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRTtBQUN0QixTQUFP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Z0JBQUEsT0FBTyxDQUFDLEdBQUcsRUFBQyxJQUFJLE1BQUEsZ0JBQUMsT0FBTyxTQUFLLE1BQU0sRUFBQyxDQUFDO0NBQzdDLENBQUM7OztBQ3ZCRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxucmVxdWlyZShcIi4uLy4uL2NvbW1vbi9zY3JpcHRzL3NoaW1zXCIpO1xubGV0IHJhbmdlID0gcmVxdWlyZShcImxvZGFzaC5yYW5nZVwiKTtcbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcbmxldCBNZW51ID0gcmVxdWlyZShcIi4vbWVudVwiKTtcblxuLy8gQVBQID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGRhdGEgPSBbXG4gIHtuYW1lOiBcIldlYiBEZXZlbG9wbWVudFwiLCBwcmljZTogMzAwfSxcbiAge25hbWU6IFwiRGVzaWduXCIsIHByaWNlOiA0MDB9LFxuICB7bmFtZTogXCJJbnRlZ3JhdGlvblwiLCBwcmljZTogMjUwfSxcbiAge25hbWU6IFwiVHJhaW5pbmdcIiwgcHJpY2U6IDIyMH1cbl07XG5cbmxldCBhY3RpdmUgPSBbXCJXZWIgRGV2ZWxvcG1lbnRcIiwgXCJJbnRlZ3JhdGlvblwiXTtcblxuZnVuY3Rpb24gcmFuZG9tSW50KG1heCkge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCArIDEpKTtcbn1cblxuZnVuY3Rpb24gcmFuZG9tRnJvbShhcnJheSkge1xuICByZXR1cm4gYXJyYXlbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyYXkubGVuZ3RoKV07XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tQWN0aXZlKGRhdGEpIHtcbiAgbGV0IG5hbWVzID0gZGF0YS5tYXAoaXRlbSA9PiBpdGVtLm5hbWUpO1xuICBsZXQgcmFuZG9tQ291bnQgPSByYW5kb21JbnQobmFtZXMubGVuZ3RoIC0gMSk7XG4gIGxldCByYW5kb21JdGVtcyA9IHJhbmdlKHJhbmRvbUNvdW50KS5tYXAoKCkgPT4gcmFuZG9tRnJvbShuYW1lcykpO1xuICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KHJhbmRvbUl0ZW1zKSk7XG59XG5cbmxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKCgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBhY3RpdmUkOiBSeC5PYnNlcnZhYmxlLmludGVydmFsKDIwMDApXG4gICAgICAubWFwKCgpID0+IGdlbmVyYXRlUmFuZG9tQWN0aXZlKGRhdGEpKSxcbiAgfVxufSk7XG5cbmxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiAoe1xuICB2dHJlZSQ6IE1vZGVsLmdldChcImFjdGl2ZSRcIikubWFwKGFjdGl2ZSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgICAgaCgnTWVudScsIHtpdGVtczogZGF0YSwgYWN0aXZlOiBhY3RpdmV9KVxuICAgICAgXSlcbiAgICApO1xuICB9KSxcbn0pKTtcblxuQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIikuaW5qZWN0KFZpZXcpLmluamVjdChNb2RlbCk7IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEN5Y2xlID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5sZXQge1J4LCBofSA9IEN5Y2xlO1xubGV0IG1ha2VDbGFzcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5DeWNsZS5yZWdpc3RlckN1c3RvbUVsZW1lbnQoXCJNZW51XCIsIChVc2VyLCBQcm9wcykgPT4ge1xuICBsZXQgTW9kZWwgPSBDeWNsZS5jcmVhdGVNb2RlbCgoSW50ZW50LCBQcm9wcykgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtcyQ6IFByb3BzLmdldChcIml0ZW1zJFwiKS5zdGFydFdpdGgoW10pLFxuICAgICAgYWN0aXZlJDogUHJvcHMuZ2V0KFwiYWN0aXZlJFwiKVxuICAgICAgICAubWVyZ2UoSW50ZW50LmdldChcInNlbGVjdE9yVW5zZWxlY3QkXCIpLm1hcChuYW1lID0+IFtuYW1lXSkpXG4gICAgICAgIC5zdGFydFdpdGgoW10pXG4gICAgICAgIC5zY2FuKChzdGF0ZSwgbmFtZXMpID0+IHtcbiAgICAgICAgICByZXR1cm4gbmFtZXMucmVkdWNlKChzdGF0ZSwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgICAgaWYgKHN0YXRlLmluZGV4T2YobmFtZSkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBTZWxlY3RcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuY29uY2F0KFtuYW1lXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVW5zZWxlY3RcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuZmlsdGVyKG4gPT4gbiAhPSBuYW1lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gS2VlcCBjdXJyZW50XG4gICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgIH0pLFxuICAgIH07XG4gIH0pO1xuXG4gIGxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiB7XG4gICAgbGV0IGl0ZW1zJCA9IE1vZGVsLmdldChcIml0ZW1zJFwiKTtcbiAgICBsZXQgYWN0aXZlJCA9IE1vZGVsLmdldChcImFjdGl2ZSRcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZ0cmVlJDogaXRlbXMkLmNvbWJpbmVMYXRlc3QoYWN0aXZlJCwgKGl0ZW1zLCBhY3RpdmUpID0+IHtcbiAgICAgICAgbGV0IHRvdGFsUHJpY2UgPSBpdGVtc1xuICAgICAgICAgIC5maWx0ZXIoaXRlbSA9PiBhY3RpdmUuaW5kZXhPZihpdGVtLm5hbWUpICE9IC0xKVxuICAgICAgICAgIC5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gKHN1bSArIGl0ZW0ucHJpY2UpLCAwKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBoKCdkaXYnLCBudWxsLCBbXG4gICAgICAgICAgICBoKCduYXYnLCBudWxsLCBbXG4gICAgICAgICAgICAgIGl0ZW1zLm1hcChpdGVtID0+XG4gICAgICAgICAgICAgICAgaCgnZGl2Jywge2F0dHJpYnV0ZXM6IHtcImRhdGEtbmFtZVwiOiBpdGVtLm5hbWV9LCBrZXk6IGl0ZW0ubmFtZSxcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogbWFrZUNsYXNzKHtcIml0ZW1cIjogdHJ1ZSwgYWN0aXZlOiBhY3RpdmUuaW5kZXhPZihpdGVtLm5hbWUpICE9IC0xfSl9LCBbXG4gICAgICAgICAgICAgICAgICBpdGVtLm5hbWUsIFwiIFwiLCBoKCdiJywgbnVsbCwgW1wiJFwiLCBpdGVtLnByaWNlLnRvRml4ZWQoMildKVxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgICAgICAgICAgICBcIlRvdGFsOiBcIiwgaCgnYicsIG51bGwsIFtcIiRcIiwgdG90YWxQcmljZS50b0ZpeGVkKDIpXSlcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXSlcbiAgICAgICAgKTtcbiAgICAgIH0pLFxuICAgICAgLy8gVE9ETyBodHRwczovL2dpdGh1Yi5jb20vYWxleG1pbmdvaWEvanN4LXRyYW5zZm9ybS9pc3N1ZXMvMTVcbiAgICB9O1xuICB9KTtcblxuICBsZXQgSW50ZW50ID0gQ3ljbGUuY3JlYXRlSW50ZW50KFVzZXIgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBzZWxlY3RPclVuc2VsZWN0JDogVXNlci5ldmVudCQoXCJuYXYgLml0ZW1cIiwgXCJjbGlja1wiKVxuICAgICAgICAubWFwKGV2ZW50ID0+IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5uYW1lKSxcbiAgICB9O1xuICB9KTtcblxuICBVc2VyLmluamVjdChWaWV3KS5pbmplY3QoTW9kZWwpLmluamVjdChJbnRlbnQsIFByb3BzKVswXS5pbmplY3QoVXNlcik7XG59KTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiYmFiZWwvcG9seWZpbGxcIik7XG5cbi8vIFNISU1TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeH0gPSBDeWNsZTtcblxuQ3ljbGUubGF0ZXN0ID0gZnVuY3Rpb24gKERhdGFOb2RlLCBrZXlzLCByZXN1bHRTZWxlY3Rvcikge1xuICBsZXQgb2JzZXJ2YWJsZXMgPSBrZXlzLm1hcChrZXkgPT4gRGF0YU5vZGUuZ2V0KGtleSkpO1xuICBsZXQgYXJncyA9IG9ic2VydmFibGVzLmNvbmNhdChbXG4gICAgZnVuY3Rpb24gc2VsZWN0b3IoLi4ubGlzdCkge1xuICAgICAgbGV0IGl0ZW0gPSBrZXlzLnJlZHVjZSgoaXRlbSwga2V5KSA9PiB7XG4gICAgICAgIGl0ZW1ba2V5LnNsaWNlKDAsIC0xKV0gPSBsaXN0W2tleXMuaW5kZXhPZihrZXkpXTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9LCB7fSk7XG4gICAgICByZXR1cm4gcmVzdWx0U2VsZWN0b3IoaXRlbSk7XG4gICAgfVxuICBdKTtcbiAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuY29tYmluZUxhdGVzdC5hcHBseShudWxsLCBhcmdzKTtcbn07XG5cbmNvbnNvbGUuc3B5ID0gZnVuY3Rpb24gc3B5KC4uLnBhcmFtcykge1xuICByZXR1cm4gY29uc29sZS5sb2cuYmluZChjb25zb2xlLCAuLi5wYXJhbXMpO1xufTsiLCIvKipcbiAqIGxvZGFzaCAzLjAuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNy4wIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnbG9kYXNoLl9pc2l0ZXJhdGVlY2FsbCcpO1xuXG4vKiogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBudW1iZXJzIChwb3NpdGl2ZSBhbmQvb3IgbmVnYXRpdmUpIHByb2dyZXNzaW5nIGZyb21cbiAqIGBzdGFydGAgdXAgdG8sIGJ1dCBub3QgaW5jbHVkaW5nLCBgZW5kYC4gSWYgYHN0YXJ0YCBpcyBsZXNzIHRoYW4gYGVuZGAgYVxuICogemVyby1sZW5ndGggcmFuZ2UgaXMgY3JlYXRlZCB1bmxlc3MgYSBuZWdhdGl2ZSBgc3RlcGAgaXMgc3BlY2lmaWVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0eVxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgb2YgdGhlIHJhbmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgZW5kIG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlcD0xXSBUaGUgdmFsdWUgdG8gaW5jcmVtZW50IG9yIGRlY3JlbWVudCBieS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIG51bWJlcnMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ucmFuZ2UoNCk7XG4gKiAvLyA9PiBbMCwgMSwgMiwgM11cbiAqXG4gKiBfLnJhbmdlKDEsIDUpO1xuICogLy8gPT4gWzEsIDIsIDMsIDRdXG4gKlxuICogXy5yYW5nZSgwLCAyMCwgNSk7XG4gKiAvLyA9PiBbMCwgNSwgMTAsIDE1XVxuICpcbiAqIF8ucmFuZ2UoMCwgLTQsIC0xKTtcbiAqIC8vID0+IFswLCAtMSwgLTIsIC0zXVxuICpcbiAqIF8ucmFuZ2UoMSwgNCwgMCk7XG4gKiAvLyA9PiBbMSwgMSwgMV1cbiAqXG4gKiBfLnJhbmdlKDApO1xuICogLy8gPT4gW11cbiAqL1xuZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGVuZCwgc3RlcCkge1xuICBpZiAoc3RlcCAmJiBpc0l0ZXJhdGVlQ2FsbChzdGFydCwgZW5kLCBzdGVwKSkge1xuICAgIGVuZCA9IHN0ZXAgPSBudWxsO1xuICB9XG4gIHN0YXJ0ID0gK3N0YXJ0IHx8IDA7XG4gIHN0ZXAgPSBzdGVwID09IG51bGwgPyAxIDogKCtzdGVwIHx8IDApO1xuXG4gIGlmIChlbmQgPT0gbnVsbCkge1xuICAgIGVuZCA9IHN0YXJ0O1xuICAgIHN0YXJ0ID0gMDtcbiAgfSBlbHNlIHtcbiAgICBlbmQgPSArZW5kIHx8IDA7XG4gIH1cbiAgLy8gVXNlIGBBcnJheShsZW5ndGgpYCBzbyBlbmdpbmVzIGxpa2UgQ2hha3JhIGFuZCBWOCBhdm9pZCBzbG93ZXIgbW9kZXMuXG4gIC8vIFNlZSBodHRwczovL3lvdXR1LmJlL1hBcUlwR1U4WlprI3Q9MTdtMjVzIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGNlaWwoKGVuZCAtIHN0YXJ0KSAvIChzdGVwIHx8IDEpKSwgMCksXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IHN0YXJ0O1xuICAgIHN0YXJ0ICs9IHN0ZXA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByYW5nZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC40IChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogVXNlZCBhcyB0aGUgbWF4aW11bSBsZW5ndGggb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqIFNlZSB0aGUgW0VTIHNwZWNdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSArdmFsdWU7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGg7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBwcm92aWRlZCBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInKSB7XG4gICAgdmFyIGxlbmd0aCA9IG9iamVjdC5sZW5ndGgsXG4gICAgICAgIHByZXJlcSA9IGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChpbmRleCwgbGVuZ3RoKTtcbiAgfSBlbHNlIHtcbiAgICBwcmVyZXEgPSB0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdDtcbiAgfVxuICBpZiAocHJlcmVxKSB7XG4gICAgdmFyIG90aGVyID0gb2JqZWN0W2luZGV4XTtcbiAgICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gKHZhbHVlID09PSBvdGhlcikgOiAob3RoZXIgIT09IG90aGVyKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBFUyBgVG9MZW5ndGhgLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgbGFuZ3VhZ2UgdHlwZSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqICoqTm90ZToqKiBTZWUgdGhlIFtFUzUgc3BlY10oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnZnVuY3Rpb24nIHx8ICh2YWx1ZSAmJiB0eXBlID09ICdvYmplY3QnKSB8fCBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcbiJdfQ==
