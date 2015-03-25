(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/ivankleshnin/JavaScript/cyclejs-examples/examples/4.3-menu-stream/build/scripts/app.js":[function(require,module,exports){
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
      return h("div", null, [h("Menu", { items: data, active: active })]);
    }) };
});

Cycle.createDOMUser("main").inject(View).inject(Model);

},{"./menu":"/Users/ivankleshnin/JavaScript/cyclejs-examples/examples/4.3-menu-stream/build/scripts/menu.js","./shims":"/Users/ivankleshnin/JavaScript/cyclejs-examples/examples/4.3-menu-stream/build/scripts/shims.js","cyclejs":"cyclejs","lodash.range":"/Users/ivankleshnin/JavaScript/cyclejs-examples/node_modules/lodash.range/index.js"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/examples/4.3-menu-stream/build/scripts/menu.js":[function(require,module,exports){
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

},{"classnames":"classnames","cyclejs":"cyclejs"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/examples/4.3-menu-stream/build/scripts/shims.js":[function(require,module,exports){
"use strict";

require("babel/polyfill");

},{"babel/polyfill":"babel/polyfill"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/node_modules/lodash.range/index.js":[function(require,module,exports){
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

},{"lodash._isiterateecall":"/Users/ivankleshnin/JavaScript/cyclejs-examples/node_modules/lodash.range/node_modules/lodash._isiterateecall/index.js"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/node_modules/lodash.range/node_modules/lodash._isiterateecall/index.js":[function(require,module,exports){
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

},{}]},{},["/Users/ivankleshnin/JavaScript/cyclejs-examples/examples/4.3-menu-stream/build/scripts/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9zY3JpcHRzL2FwcC5qcyIsImJ1aWxkL3NjcmlwdHMvbWVudS5qcyIsImJ1aWxkL3NjcmlwdHMvc2hpbXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLnJhbmdlL2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC5yYW5nZS9ub2RlX21vZHVsZXMvbG9kYXNoLl9pc2l0ZXJhdGVlY2FsbC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0NBLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBTyxLQUFLLENBQWQsRUFBRTtJQUFFLENBQUMsR0FBSSxLQUFLLENBQVYsQ0FBQzs7QUFDVixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUc3QixJQUFJLElBQUksR0FBRyxDQUNULEVBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsRUFDckMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsRUFDNUIsRUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsRUFDakMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsQ0FDL0IsQ0FBQzs7QUFFRixJQUFJLE1BQU0sR0FBRyxDQUFDLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxDQUFDOztBQUVoRCxTQUFT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TSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ3ZFLENBQUMsQ0FBQzs7Ozs7OztBQ25FSCxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7O0FDQTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiLi9zaGltc1wiKTtcbmxldCByYW5nZSA9IHJlcXVpcmUoXCJsb2Rhc2gucmFuZ2VcIik7XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5sZXQgTWVudSA9IHJlcXVpcmUoXCIuL21lbnVcIik7XG5cbi8vIEFQUCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBkYXRhID0gW1xuICB7bmFtZTogXCJXZWIgRGV2ZWxvcG1lbnRcIiwgcHJpY2U6IDMwMH0sXG4gIHtuYW1lOiBcIkRlc2lnblwiLCBwcmljZTogNDAwfSxcbiAge25hbWU6IFwiSW50ZWdyYXRpb25cIiwgcHJpY2U6IDI1MH0sXG4gIHtuYW1lOiBcIlRyYWluaW5nXCIsIHByaWNlOiAyMjB9XG5dO1xuXG5sZXQgYWN0aXZlID0gW1wiV2ViIERldmVsb3BtZW50XCIsIFwiSW50ZWdyYXRpb25cIl07XG5cbmZ1bmN0aW9uIHJhbmRvbUludChtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggKyAxKSk7XG59XG5cbmZ1bmN0aW9uIHJhbmRvbUZyb20oYXJyYXkpIHtcbiAgcmV0dXJuIGFycmF5W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFycmF5Lmxlbmd0aCldO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJhbmRvbUFjdGl2ZShkYXRhKSB7XG4gIGxldCBuYW1lcyA9IGRhdGEubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKTtcbiAgbGV0IHJhbmRvbUNvdW50ID0gcmFuZG9tSW50KG5hbWVzLmxlbmd0aCAtIDEpO1xuICBsZXQgcmFuZG9tSXRlbXMgPSByYW5nZShyYW5kb21Db3VudCkubWFwKCgpID0+IHJhbmRvbUZyb20obmFtZXMpKTtcbiAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChyYW5kb21JdGVtcykpO1xufVxuXG5sZXQgTW9kZWwgPSBDeWNsZS5jcmVhdGVNb2RlbCgoKSA9PiB7XG4gIHJldHVybiB7XG4gICAgYWN0aXZlJDogUnguT2JzZXJ2YWJsZS5pbnRlcnZhbCgyMDAwKVxuICAgICAgLm1hcCgoKSA9PiBnZW5lcmF0ZVJhbmRvbUFjdGl2ZShkYXRhKSksXG4gIH1cbn0pO1xuXG5sZXQgVmlldyA9IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4gKHtcbiAgdnRyZWUkOiBNb2RlbC5nZXQoXCJhY3RpdmUkXCIpLm1hcChhY3RpdmUgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICBoKCdkaXYnLCBudWxsLCBbXG4gICAgICAgIGgoJ01lbnUnLCB7aXRlbXM6IGRhdGEsIGFjdGl2ZTogYWN0aXZlfSlcbiAgICAgIF0pXG4gICAgKTtcbiAgfSksXG59KSk7XG5cbkN5Y2xlLmNyZWF0ZURPTVVzZXIoXCJtYWluXCIpLmluamVjdChWaWV3KS5pbmplY3QoTW9kZWwpOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcbmxldCBtYWtlQ2xhc3MgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQ3ljbGUucmVnaXN0ZXJDdXN0b21FbGVtZW50KFwiTWVudVwiLCAoVXNlciwgUHJvcHMpID0+IHtcbiAgbGV0IE1vZGVsID0gQ3ljbGUuY3JlYXRlTW9kZWwoKEludGVudCwgUHJvcHMpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXMkOiBQcm9wcy5nZXQoXCJpdGVtcyRcIikuc3RhcnRXaXRoKFtdKSxcbiAgICAgIGFjdGl2ZSQ6IFByb3BzLmdldChcImFjdGl2ZSRcIikuc3RhcnRXaXRoKFtdKVxuICAgICAgICAubWVyZ2UoSW50ZW50LmdldChcInNlbGVjdE9yVW5zZWxlY3QkXCIpLm1hcChuYW1lID0+IFtuYW1lXSkpXG4gICAgICAgIC5zY2FuKChzdGF0ZSwgbmFtZXMpID0+IHtcbiAgICAgICAgICByZXR1cm4gbmFtZXMucmVkdWNlKChzdGF0ZSwgbmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgICAgaWYgKHN0YXRlLmluZGV4T2YobmFtZSkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBTZWxlY3RcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuY29uY2F0KFtuYW1lXSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVW5zZWxlY3RcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuZmlsdGVyKG4gPT4gbiAhPSBuYW1lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gS2VlcCBjdXJyZW50XG4gICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBzdGF0ZSk7XG4gICAgICAgIH0pLFxuICAgIH07XG4gIH0pO1xuXG4gIGxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiB7XG4gICAgbGV0IGl0ZW1zJCA9IE1vZGVsLmdldChcIml0ZW1zJFwiKTtcbiAgICBsZXQgYWN0aXZlJCA9IE1vZGVsLmdldChcImFjdGl2ZSRcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZ0cmVlJDogaXRlbXMkLmNvbWJpbmVMYXRlc3QoYWN0aXZlJCwgKGl0ZW1zLCBhY3RpdmUpID0+IHtcbiAgICAgICAgbGV0IHRvdGFsUHJpY2UgPSBpdGVtc1xuICAgICAgICAgIC5maWx0ZXIoaXRlbSA9PiBhY3RpdmUuaW5kZXhPZihpdGVtLm5hbWUpICE9IC0xKVxuICAgICAgICAgIC5yZWR1Y2UoKHN1bSwgaXRlbSkgPT4gKHN1bSArIGl0ZW0ucHJpY2UpLCAwKTtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBoKCdkaXYnLCBudWxsLCBbXG4gICAgICAgICAgICBoKCduYXYnLCBudWxsLCBbXG4gICAgICAgICAgICAgIGl0ZW1zLm1hcChpdGVtID0+XG4gICAgICAgICAgICAgICAgaCgnZGl2Jywge2F0dHJpYnV0ZXM6IHtcImRhdGEtbmFtZVwiOiBpdGVtLm5hbWV9LCBrZXk6IGl0ZW0ubmFtZSxcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogbWFrZUNsYXNzKHtcIml0ZW1cIjogdHJ1ZSwgYWN0aXZlOiBhY3RpdmUuaW5kZXhPZihpdGVtLm5hbWUpICE9IC0xfSl9LCBbXG4gICAgICAgICAgICAgICAgICBpdGVtLm5hbWUsIFwiIFwiLCBoKCdiJywgbnVsbCwgW1wiJFwiLCBpdGVtLnByaWNlLnRvRml4ZWQoMildKVxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgICAgICAgICAgICBcIlRvdGFsOiBcIiwgaCgnYicsIG51bGwsIFtcIiRcIiwgdG90YWxQcmljZS50b0ZpeGVkKDIpXSlcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXSlcbiAgICAgICAgKTtcbiAgICAgIH0pLFxuICAgICAgLy8gVE9ETyBodHRwczovL2dpdGh1Yi5jb20vYWxleG1pbmdvaWEvanN4LXRyYW5zZm9ybS9pc3N1ZXMvMTVcbiAgICB9O1xuICB9KTtcblxuICBsZXQgSW50ZW50ID0gQ3ljbGUuY3JlYXRlSW50ZW50KFVzZXIgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBzZWxlY3RPclVuc2VsZWN0JDogVXNlci5ldmVudCQoXCJuYXYgLml0ZW1cIiwgXCJjbGlja1wiKVxuICAgICAgICAubWFwKGV2ZW50ID0+IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5uYW1lKSxcbiAgICB9O1xuICB9KTtcblxuICBVc2VyLmluamVjdChWaWV3KS5pbmplY3QoTW9kZWwpLmluamVjdChJbnRlbnQsIFByb3BzKVswXS5pbmplY3QoVXNlcik7XG59KTsiLCJyZXF1aXJlKFwiYmFiZWwvcG9seWZpbGxcIik7IiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjAgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjcuMCA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cbnZhciBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJ2xvZGFzaC5faXNpdGVyYXRlZWNhbGwnKTtcblxuLyoqIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBjZWlsID0gTWF0aC5jZWlsO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgbnVtYmVycyAocG9zaXRpdmUgYW5kL29yIG5lZ2F0aXZlKSBwcm9ncmVzc2luZyBmcm9tXG4gKiBgc3RhcnRgIHVwIHRvLCBidXQgbm90IGluY2x1ZGluZywgYGVuZGAuIElmIGBzdGFydGAgaXMgbGVzcyB0aGFuIGBlbmRgIGFcbiAqIHplcm8tbGVuZ3RoIHJhbmdlIGlzIGNyZWF0ZWQgdW5sZXNzIGEgbmVnYXRpdmUgYHN0ZXBgIGlzIHNwZWNpZmllZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxpdHlcbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgVGhlIGVuZCBvZiB0aGUgcmFuZ2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0ZXA9MV0gVGhlIHZhbHVlIHRvIGluY3JlbWVudCBvciBkZWNyZW1lbnQgYnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBudW1iZXJzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnJhbmdlKDQpO1xuICogLy8gPT4gWzAsIDEsIDIsIDNdXG4gKlxuICogXy5yYW5nZSgxLCA1KTtcbiAqIC8vID0+IFsxLCAyLCAzLCA0XVxuICpcbiAqIF8ucmFuZ2UoMCwgMjAsIDUpO1xuICogLy8gPT4gWzAsIDUsIDEwLCAxNV1cbiAqXG4gKiBfLnJhbmdlKDAsIC00LCAtMSk7XG4gKiAvLyA9PiBbMCwgLTEsIC0yLCAtM11cbiAqXG4gKiBfLnJhbmdlKDEsIDQsIDApO1xuICogLy8gPT4gWzEsIDEsIDFdXG4gKlxuICogXy5yYW5nZSgwKTtcbiAqIC8vID0+IFtdXG4gKi9cbmZ1bmN0aW9uIHJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgaWYgKHN0ZXAgJiYgaXNJdGVyYXRlZUNhbGwoc3RhcnQsIGVuZCwgc3RlcCkpIHtcbiAgICBlbmQgPSBzdGVwID0gbnVsbDtcbiAgfVxuICBzdGFydCA9ICtzdGFydCB8fCAwO1xuICBzdGVwID0gc3RlcCA9PSBudWxsID8gMSA6ICgrc3RlcCB8fCAwKTtcblxuICBpZiAoZW5kID09IG51bGwpIHtcbiAgICBlbmQgPSBzdGFydDtcbiAgICBzdGFydCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgZW5kID0gK2VuZCB8fCAwO1xuICB9XG4gIC8vIFVzZSBgQXJyYXkobGVuZ3RoKWAgc28gZW5naW5lcyBsaWtlIENoYWtyYSBhbmQgVjggYXZvaWQgc2xvd2VyIG1vZGVzLlxuICAvLyBTZWUgaHR0cHM6Ly95b3V0dS5iZS9YQXFJcEdVOFpaayN0PTE3bTI1cyBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChjZWlsKChlbmQgLSBzdGFydCkgLyAoc3RlcCB8fCAxKSksIDApLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBzdGFydDtcbiAgICBzdGFydCArPSBzdGVwO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmFuZ2U7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuNCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4yIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIFVzZWQgYXMgdGhlIG1heGltdW0gbGVuZ3RoIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKiBTZWUgdGhlIFtFUyBzcGVjXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhbHVlID0gK3ZhbHVlO1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgcHJvdmlkZWQgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJdGVyYXRlZUNhbGwodmFsdWUsIGluZGV4LCBvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIGluZGV4O1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJykge1xuICAgIHZhciBsZW5ndGggPSBvYmplY3QubGVuZ3RoLFxuICAgICAgICBwcmVyZXEgPSBpc0xlbmd0aChsZW5ndGgpICYmIGlzSW5kZXgoaW5kZXgsIGxlbmd0aCk7XG4gIH0gZWxzZSB7XG4gICAgcHJlcmVxID0gdHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3Q7XG4gIH1cbiAgaWYgKHByZXJlcSkge1xuICAgIHZhciBvdGhlciA9IG9iamVjdFtpbmRleF07XG4gICAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/ICh2YWx1ZSA9PT0gb3RoZXIpIDogKG90aGVyICE9PSBvdGhlcik7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgYmFzZWQgb24gRVMgYFRvTGVuZ3RoYC4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy10b2xlbmd0aClcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIGxhbmd1YWdlIHR5cGUgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiAqKk5vdGU6KiogU2VlIHRoZSBbRVM1IHNwZWNdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHR5cGUgPT0gJ2Z1bmN0aW9uJyB8fCAodmFsdWUgJiYgdHlwZSA9PSAnb2JqZWN0JykgfHwgZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJdGVyYXRlZUNhbGw7XG4iXX0=
