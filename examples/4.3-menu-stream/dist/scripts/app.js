(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("./shims");
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
      return h("Menu", { items: data, active: active });
    }) };
});

Cycle.createDOMUser("main").inject(View).inject(Model);

},{"./menu":2,"./shims":3,"cyclejs":"cyclejs","lodash.range":4}],2:[function(require,module,exports){
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
      active$: Props.get("active$").startWith([]).merge(Intent.get("selectOrUnselect$").map(function (name) {
        return [name];
      })).scan(function (state, names) {
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

require("babel/polyfill");

},{"babel/polyfill":"babel/polyfill"}],4:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL3NjcmlwdHMvYXBwLmpzIiwiYnVpbGQvc2NyaXB0cy9tZW51LmpzIiwiYnVpbGQvc2NyaXB0cy9zaGltcy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gucmFuZ2UvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLnJhbmdlL25vZGVfbW9kdWxlcy9sb2Rhc2guX2lzaXRlcmF0ZWVjYWxsL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25CLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUIsRUFBRSxHQUFPLEtBQUssQ0FBZCxFQUFFO0lBQUUsQ0FBQyxHQUFJLEtBQUssQ0FBVixDQUFDOztBQUNWLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBRzdCLElBQUksSUFBSSxHQUFHLENBQ1QsRUFBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxFQUNyQyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxFQUM1QixFQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxFQUNqQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUMvQixDQUFDOztBQUVGLElBQUksTUFBTSxHQUFHLENBQUMsaUJBQWlCLEVBQUUsYUFBYSxDQUFDLENBQUM7O0FBRWhELFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRTtB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Q0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDdkUsQ0FBQyxDQUFDOzs7Ozs7O0FDbkVILE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUNBMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnJlcXVpcmUoXCIuL3NoaW1zXCIpO1xubGV0IHJhbmdlID0gcmVxdWlyZShcImxvZGFzaC5yYW5nZVwiKTtcbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcbmxldCBNZW51ID0gcmVxdWlyZShcIi4vbWVudVwiKTtcblxuLy8gQVBQID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGRhdGEgPSBbXG4gIHtuYW1lOiBcIldlYiBEZXZlbG9wbWVudFwiLCBwcmljZTogMzAwfSxcbiAge25hbWU6IFwiRGVzaWduXCIsIHByaWNlOiA0MDB9LFxuICB7bmFtZTogXCJJbnRlZ3JhdGlvblwiLCBwcmljZTogMjUwfSxcbiAge25hbWU6IFwiVHJhaW5pbmdcIiwgcHJpY2U6IDIyMH1cbl07XG5cbmxldCBhY3RpdmUgPSBbXCJXZWIgRGV2ZWxvcG1lbnRcIiwgXCJJbnRlZ3JhdGlvblwiXTtcblxuZnVuY3Rpb24gcmFuZG9tSW50KG1heCkge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCArIDEpKTtcbn1cblxuZnVuY3Rpb24gcmFuZG9tRnJvbShhcnJheSkge1xuICByZXR1cm4gYXJyYXlbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXJyYXkubGVuZ3RoKV07XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tQWN0aXZlKGRhdGEpIHtcbiAgbGV0IG5hbWVzID0gZGF0YS5tYXAoaXRlbSA9PiBpdGVtLm5hbWUpO1xuICBsZXQgcmFuZG9tQ291bnQgPSByYW5kb21JbnQobmFtZXMubGVuZ3RoIC0gMSk7XG4gIGxldCByYW5kb21JdGVtcyA9IHJhbmdlKHJhbmRvbUNvdW50KS5tYXAoKCkgPT4gcmFuZG9tRnJvbShuYW1lcykpO1xuICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KHJhbmRvbUl0ZW1zKSk7XG59XG5cbmxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKCgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBhY3RpdmUkOiBSeC5PYnNlcnZhYmxlLmludGVydmFsKDIwMDApXG4gICAgICAubWFwKCgpID0+IGdlbmVyYXRlUmFuZG9tQWN0aXZlKGRhdGEpKSxcbiAgfVxufSk7XG5cbmxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiAoe1xuICB2dHJlZSQ6IE1vZGVsLmdldChcImFjdGl2ZSRcIikubWFwKGFjdGl2ZSA9PiB7XG4gICAgcmV0dXJuIGgoJ01lbnUnLCB7aXRlbXM6IGRhdGEsIGFjdGl2ZTogYWN0aXZlfSk7XG4gIH0pLFxufSkpO1xuXG5DeWNsZS5jcmVhdGVET01Vc2VyKFwibWFpblwiKS5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5sZXQgbWFrZUNsYXNzID0gcmVxdWlyZShcImNsYXNzbmFtZXNcIik7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkN5Y2xlLnJlZ2lzdGVyQ3VzdG9tRWxlbWVudChcIk1lbnVcIiwgKFVzZXIsIFByb3BzKSA9PiB7XG4gIGxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKChJbnRlbnQsIFByb3BzKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zJDogUHJvcHMuZ2V0KFwiaXRlbXMkXCIpLnN0YXJ0V2l0aChbXSksXG4gICAgICBhY3RpdmUkOiBQcm9wcy5nZXQoXCJhY3RpdmUkXCIpLnN0YXJ0V2l0aChbXSlcbiAgICAgICAgLm1lcmdlKEludGVudC5nZXQoXCJzZWxlY3RPclVuc2VsZWN0JFwiKS5tYXAobmFtZSA9PiBbbmFtZV0pKVxuICAgICAgICAuc2Nhbigoc3RhdGUsIG5hbWVzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5hbWVzLnJlZHVjZSgoc3RhdGUsIG5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgICAgICAgIGlmIChzdGF0ZS5pbmRleE9mKG5hbWUpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gU2VsZWN0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmNvbmNhdChbbmFtZV0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFVuc2VsZWN0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmZpbHRlcihuID0+IG4gIT0gbmFtZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIEtlZXAgY3VycmVudFxuICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgc3RhdGUpO1xuICAgICAgICB9KSxcbiAgICB9O1xuICB9KTtcblxuICBsZXQgVmlldyA9IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4ge1xuICAgIGxldCBpdGVtcyQgPSBNb2RlbC5nZXQoXCJpdGVtcyRcIik7XG4gICAgbGV0IGFjdGl2ZSQgPSBNb2RlbC5nZXQoXCJhY3RpdmUkXCIpO1xuICAgIHJldHVybiB7XG4gICAgICB2dHJlZSQ6IGl0ZW1zJC5jb21iaW5lTGF0ZXN0KGFjdGl2ZSQsIChpdGVtcywgYWN0aXZlKSA9PiB7XG4gICAgICAgIGxldCB0b3RhbFByaWNlID0gaXRlbXNcbiAgICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gYWN0aXZlLmluZGV4T2YoaXRlbS5uYW1lKSAhPSAtMSlcbiAgICAgICAgICAucmVkdWNlKChzdW0sIGl0ZW0pID0+IChzdW0gKyBpdGVtLnByaWNlKSwgMCk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgaCgnZGl2JywgbnVsbCwgW1xuICAgICAgICAgICAgaCgnbmF2JywgbnVsbCwgW1xuICAgICAgICAgICAgICBpdGVtcy5tYXAoaXRlbSA9PlxuICAgICAgICAgICAgICAgIGgoJ2RpdicsIHthdHRyaWJ1dGVzOiB7XCJkYXRhLW5hbWVcIjogaXRlbS5uYW1lfSwga2V5OiBpdGVtLm5hbWUsXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IG1ha2VDbGFzcyh7XCJpdGVtXCI6IHRydWUsIGFjdGl2ZTogYWN0aXZlLmluZGV4T2YoaXRlbS5uYW1lKSAhPSAtMX0pfSwgW1xuICAgICAgICAgICAgICAgICAgaXRlbS5uYW1lLCBcIiBcIiwgaCgnYicsIG51bGwsIFtcIiRcIiwgaXRlbS5wcmljZS50b0ZpeGVkKDIpXSlcbiAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICBoKCdkaXYnLCBudWxsLCBbXG4gICAgICAgICAgICAgICAgXCJUb3RhbDogXCIsIGgoJ2InLCBudWxsLCBbXCIkXCIsIHRvdGFsUHJpY2UudG9GaXhlZCgyKV0pXG4gICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICBdKVxuICAgICAgICAgIF0pXG4gICAgICAgICk7XG4gICAgICB9KSxcbiAgICAgIC8vIFRPRE8gaHR0cHM6Ly9naXRodWIuY29tL2FsZXhtaW5nb2lhL2pzeC10cmFuc2Zvcm0vaXNzdWVzLzE1XG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IEludGVudCA9IEN5Y2xlLmNyZWF0ZUludGVudChVc2VyID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgc2VsZWN0T3JVbnNlbGVjdCQ6IFVzZXIuZXZlbnQkKFwibmF2IC5pdGVtXCIsIFwiY2xpY2tcIilcbiAgICAgICAgLm1hcChldmVudCA9PiBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQubmFtZSksXG4gICAgfTtcbiAgfSk7XG5cbiAgVXNlci5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50LCBQcm9wcylbMF0uaW5qZWN0KFVzZXIpO1xufSk7IiwicmVxdWlyZShcImJhYmVsL3BvbHlmaWxsXCIpOyIsIi8qKlxuICogbG9kYXNoIDMuMC4wIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS43LjAgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG52YXIgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCdsb2Rhc2guX2lzaXRlcmF0ZWVjYWxsJyk7XG5cbi8qKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG51bWJlcnMgKHBvc2l0aXZlIGFuZC9vciBuZWdhdGl2ZSkgcHJvZ3Jlc3NpbmcgZnJvbVxuICogYHN0YXJ0YCB1cCB0bywgYnV0IG5vdCBpbmNsdWRpbmcsIGBlbmRgLiBJZiBgc3RhcnRgIGlzIGxlc3MgdGhhbiBgZW5kYCBhXG4gKiB6ZXJvLWxlbmd0aCByYW5nZSBpcyBjcmVhdGVkIHVubGVzcyBhIG5lZ2F0aXZlIGBzdGVwYCBpcyBzcGVjaWZpZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXR5XG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBvZiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gZW5kIFRoZSBlbmQgb2YgdGhlIHJhbmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGVwPTFdIFRoZSB2YWx1ZSB0byBpbmNyZW1lbnQgb3IgZGVjcmVtZW50IGJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgbnVtYmVycy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5yYW5nZSg0KTtcbiAqIC8vID0+IFswLCAxLCAyLCAzXVxuICpcbiAqIF8ucmFuZ2UoMSwgNSk7XG4gKiAvLyA9PiBbMSwgMiwgMywgNF1cbiAqXG4gKiBfLnJhbmdlKDAsIDIwLCA1KTtcbiAqIC8vID0+IFswLCA1LCAxMCwgMTVdXG4gKlxuICogXy5yYW5nZSgwLCAtNCwgLTEpO1xuICogLy8gPT4gWzAsIC0xLCAtMiwgLTNdXG4gKlxuICogXy5yYW5nZSgxLCA0LCAwKTtcbiAqIC8vID0+IFsxLCAxLCAxXVxuICpcbiAqIF8ucmFuZ2UoMCk7XG4gKiAvLyA9PiBbXVxuICovXG5mdW5jdGlvbiByYW5nZShzdGFydCwgZW5kLCBzdGVwKSB7XG4gIGlmIChzdGVwICYmIGlzSXRlcmF0ZWVDYWxsKHN0YXJ0LCBlbmQsIHN0ZXApKSB7XG4gICAgZW5kID0gc3RlcCA9IG51bGw7XG4gIH1cbiAgc3RhcnQgPSArc3RhcnQgfHwgMDtcbiAgc3RlcCA9IHN0ZXAgPT0gbnVsbCA/IDEgOiAoK3N0ZXAgfHwgMCk7XG5cbiAgaWYgKGVuZCA9PSBudWxsKSB7XG4gICAgZW5kID0gc3RhcnQ7XG4gICAgc3RhcnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIGVuZCA9ICtlbmQgfHwgMDtcbiAgfVxuICAvLyBVc2UgYEFycmF5KGxlbmd0aClgIHNvIGVuZ2luZXMgbGlrZSBDaGFrcmEgYW5kIFY4IGF2b2lkIHNsb3dlciBtb2Rlcy5cbiAgLy8gU2VlIGh0dHBzOi8veW91dHUuYmUvWEFxSXBHVThaWmsjdD0xN20yNXMgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBuYXRpdmVNYXgoY2VpbCgoZW5kIC0gc3RhcnQpIC8gKHN0ZXAgfHwgMSkpLCAwKSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gc3RhcnQ7XG4gICAgc3RhcnQgKz0gc3RlcDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJhbmdlO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjQgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMiA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBVc2VkIGFzIHRoZSBtYXhpbXVtIGxlbmd0aCBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICogU2VlIHRoZSBbRVMgc3BlY10oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW51bWJlci5tYXhfc2FmZV9pbnRlZ2VyKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICB2YWx1ZSA9ICt2YWx1ZTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicpIHtcbiAgICB2YXIgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aCxcbiAgICAgICAgcHJlcmVxID0gaXNMZW5ndGgobGVuZ3RoKSAmJiBpc0luZGV4KGluZGV4LCBsZW5ndGgpO1xuICB9IGVsc2Uge1xuICAgIHByZXJlcSA9IHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0O1xuICB9XG4gIGlmIChwcmVyZXEpIHtcbiAgICB2YXIgb3RoZXIgPSBvYmplY3RbaW5kZXhdO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAodmFsdWUgPT09IG90aGVyKSA6IChvdGhlciAhPT0gb3RoZXIpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIEVTIGBUb0xlbmd0aGAuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBsYW5ndWFnZSB0eXBlIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogKipOb3RlOioqIFNlZSB0aGUgW0VTNSBzcGVjXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB0eXBlID09ICdmdW5jdGlvbicgfHwgKHZhbHVlICYmIHR5cGUgPT0gJ29iamVjdCcpIHx8IGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSXRlcmF0ZWVDYWxsO1xuIl19
