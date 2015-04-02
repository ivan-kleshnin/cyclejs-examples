(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("../../common/scripts/shims");
var Cycle = require("cyclejs");
var Model = require("./model");
var View = require("./view");
var Intent = require("./intent");

// APP =============================================================================================
var User = Cycle.createDOMUser("main");

User.inject(View).inject(Model).inject(Intent).inject(User);

},{"../../common/scripts/shims":6,"./intent":2,"./model":3,"./view":5,"cyclejs":"cyclejs"}],2:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// EXPORTS =========================================================================================
var Intent = Cycle.createIntent(function (User) {
  return {
    changeValue$: User.event$(".slider", "changeValue").map(function (event) {
      return event.data;
    }) };
});

module.exports = Intent;

},{"cyclejs":"cyclejs"}],3:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var range = require("lodash.range");
var UUID = require("node-uuid");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// EXPORTS =========================================================================================
var Model = Cycle.createModel(function (Intent) {
  var changeValue$ = Intent.get("changeValue$").map(function (item) {
    return function transform(state) {
      state[item.id].value = item.value;
      return state;
    };
  });

  var transform$ = Rx.Observable.merge(changeValue$);

  return {
    state$: transform$.startWith(seedState()).scan(function (state, transform) {
      return transform(state);
    }) };
});

// HELPERS ========================================================================================
function seedState() {
  var n = arguments[0] === undefined ? undefined : arguments[0];
  var max = arguments[1] === undefined ? 2 : arguments[1];

  var n = n || Math.floor(Math.random() * max) + 1;
  var items = range(n).map(seedItem);
  return items.reduce(function (state, item) {
    state[item.id] = item;
    return state;
  }, {});
}

function seedItem(withData) {
  return Object.assign({
    id: UUID.v4(),
    value: Math.floor(Math.random() * 100) + 1 }, withData);
}

module.exports = Model;

},{"cyclejs":"cyclejs","lodash.range":7,"node-uuid":"node-uuid"}],4:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("Slider", function (User, Props) {
  var Model = Cycle.createModel(function (Intent, Props) {
    return {
      id$: Props.get("id$"),
      value$: Props.get("value$").merge(Intent.get("changeValue$")).startWith(0) };
  });

  var View = Cycle.createView(function (Model) {
    var id$ = Model.get("id$");
    var value$ = Model.get("value$");
    return {
      vtree$: value$.combineLatest(id$, function (value, id) {
        return h("div", { className: "form-group" }, [h("label", null, ["Amount"]), h("div", { className: "input-group" }, [h("input", { type: "range", value: value, placeholder: "Amount" }), h("div", { className: "input-group-addon" }, [h("input", { type: "text", value: value, readonly: "1" })])])]);
      }) };
  });

  var Intent = Cycle.createIntent(function (User) {
    return {
      changeValue$: User.event$("[type=range]", "input").map(function (event) {
        return parseInt(event.target.value);
      }) };
  });

  User.inject(View).inject(Model).inject(Intent, Props)[0].inject(User);

  return {
    changeValue$: Intent.get("changeValue$").combineLatest(Model.get("id$"), function (value, id) {
      return { id: id, value: value };
    }) };
});

},{"cyclejs":"cyclejs"}],5:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var sortBy = require("lodash.sortby");
var values = require("lodash.values");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var Slider = require("./slider");

// EXPORTS =========================================================================================
var View = Cycle.createView(function (Model) {
  var state$ = Model.get("state$");
  return {
    vtree$: state$.map(function (items) {
      return h("div", { className: "sliders" }, [h("div", null, [sortBy(values(items), function (item) {
        return item.id;
      }).map(function (item) {
        return h("Slider", { id: item.id, value: item.value, key: item.id });
      })])]);
    }) };
});

module.exports = View;

},{"./slider":4,"cyclejs":"cyclejs","lodash.sortby":"lodash.sortby","lodash.values":"lodash.values"}],6:[function(require,module,exports){
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

},{"babel/polyfill":"babel/polyfill","cyclejs":"cyclejs"}],7:[function(require,module,exports){
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

},{"lodash._isiterateecall":8}],8:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC8zLjItc2xpZGVyLXN0YXRlL3NjcmlwdHMvYXBwLmpzIiwiYnVpbGQvMy4yLXNsaWRlci1zdGF0ZS9zY3JpcHRzL2ludGVudC5qcyIsImJ1aWxkLzMuMi1zbGlkZXItc3RhdGUvc2NyaXB0cy9tb2RlbC5qcyIsImJ1aWxkLzMuMi1zbGlkZXItc3RhdGUvc2NyaXB0cy9zbGlkZXIuanMiLCJidWlsZC8zLjItc2xpZGVyLXN0YXRlL3NjcmlwdHMvdmlldy5qcyIsImJ1aWxkL2NvbW1vbi9zY3JpcHRzL3NoaW1zLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5yYW5nZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gucmFuZ2Uvbm9kZV9tb2R1bGVzL2xvZGFzaC5faXNpdGVyYXRlZWNhbGwvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUN0QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7OztBQUdqQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV2QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7QUNUNUQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyaXB0cy9zaGltc1wiKTtcbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IE1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWxcIik7XG5sZXQgVmlldyA9IHJlcXVpcmUoXCIuL3ZpZXdcIik7XG5sZXQgSW50ZW50ID0gcmVxdWlyZShcIi4vaW50ZW50XCIpO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgVXNlciA9IEN5Y2xlLmNyZWF0ZURPTVVzZXIoXCJtYWluXCIpO1xuXG5Vc2VyLmluamVjdChWaWV3KS5pbmplY3QoTW9kZWwpLmluamVjdChJbnRlbnQpLmluamVjdChVc2VyKTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7Unh9ID0gQ3ljbGU7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJbnRlbnQgPSBDeWNsZS5jcmVhdGVJbnRlbnQoVXNlciA9PiB7XG4gIHJldHVybiB7XG4gICAgY2hhbmdlVmFsdWUkOiBVc2VyLmV2ZW50JChcIi5zbGlkZXJcIiwgXCJjaGFuZ2VWYWx1ZVwiKS5tYXAoZXZlbnQgPT4gZXZlbnQuZGF0YSksXG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlbnQ7IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHJhbmdlID0gcmVxdWlyZShcImxvZGFzaC5yYW5nZVwiKTtcbmxldCBVVUlEID0gcmVxdWlyZShcIm5vZGUtdXVpZFwiKTtcbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeH0gPSBDeWNsZTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IE1vZGVsID0gQ3ljbGUuY3JlYXRlTW9kZWwoSW50ZW50ID0+IHtcbiAgbGV0IGNoYW5nZVZhbHVlJCA9IEludGVudC5nZXQoXCJjaGFuZ2VWYWx1ZSRcIikubWFwKGl0ZW0gPT4ge1xuICAgIHJldHVybiBmdW5jdGlvbiB0cmFuc2Zvcm0oc3RhdGUpIHtcbiAgICAgIHN0YXRlW2l0ZW0uaWRdLnZhbHVlID0gaXRlbS52YWx1ZTtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9O1xuICB9KTtcblxuICBsZXQgdHJhbnNmb3JtJCA9IFJ4Lk9ic2VydmFibGUubWVyZ2UoXG4gICAgY2hhbmdlVmFsdWUkXG4gICk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdGF0ZSQ6IHRyYW5zZm9ybSRcbiAgICAgIC5zdGFydFdpdGgoc2VlZFN0YXRlKCkpXG4gICAgICAuc2Nhbigoc3RhdGUsIHRyYW5zZm9ybSkgPT4gdHJhbnNmb3JtKHN0YXRlKSksXG4gIH07XG59KTtcblxuLy8gSEVMUEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiBzZWVkU3RhdGUobj11bmRlZmluZWQsIG1heD0yKSB7XG4gIGxldCBuID0gbiB8fCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtYXgpICsgMTtcbiAgbGV0IGl0ZW1zID0gcmFuZ2UobikubWFwKHNlZWRJdGVtKTtcbiAgcmV0dXJuIGl0ZW1zLnJlZHVjZSgoc3RhdGUsIGl0ZW0pID0+IHtcbiAgICBzdGF0ZVtpdGVtLmlkXSA9IGl0ZW07XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9LCB7fSk7XG59XG5cbmZ1bmN0aW9uIHNlZWRJdGVtKHdpdGhEYXRhKSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICBpZDogVVVJRC52NCgpLFxuICAgIHZhbHVlOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApICsgMSxcbiAgfSwgd2l0aERhdGEpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcblxuLy8gRUxFTUVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuQ3ljbGUucmVnaXN0ZXJDdXN0b21FbGVtZW50KFwiU2xpZGVyXCIsIChVc2VyLCBQcm9wcykgPT4ge1xuICBsZXQgTW9kZWwgPSBDeWNsZS5jcmVhdGVNb2RlbCgoSW50ZW50LCBQcm9wcykgPT4gKHtcbiAgICBpZCQ6IFByb3BzLmdldChcImlkJFwiKSxcbiAgICB2YWx1ZSQ6IFByb3BzLmdldChcInZhbHVlJFwiKVxuICAgICAgLm1lcmdlKEludGVudC5nZXQoXCJjaGFuZ2VWYWx1ZSRcIikpXG4gICAgICAuc3RhcnRXaXRoKDApLFxuICB9KSk7XG5cbiAgbGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KE1vZGVsID0+IHtcbiAgICBsZXQgaWQkID0gTW9kZWwuZ2V0KFwiaWQkXCIpO1xuICAgIGxldCB2YWx1ZSQgPSBNb2RlbC5nZXQoXCJ2YWx1ZSRcIik7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZ0cmVlJDogdmFsdWUkLmNvbWJpbmVMYXRlc3QoaWQkLCAodmFsdWUsIGlkKSA9PiAoXG4gICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwiZm9ybS1ncm91cFwifSwgW1xuICAgICAgICAgIGgoJ2xhYmVsJywgbnVsbCwgW1wiQW1vdW50XCJdKSxcbiAgICAgICAgICBoKCdkaXYnLCB7Y2xhc3NOYW1lOiBcImlucHV0LWdyb3VwXCJ9LCBbXG4gICAgICAgICAgICBoKCdpbnB1dCcsIHt0eXBlOiBcInJhbmdlXCIsIHZhbHVlOiB2YWx1ZSwgcGxhY2Vob2xkZXI6IFwiQW1vdW50XCJ9KSxcbiAgICAgICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwiaW5wdXQtZ3JvdXAtYWRkb25cIn0sIFtcbiAgICAgICAgICAgICAgaCgnaW5wdXQnLCB7dHlwZTogXCJ0ZXh0XCIsIHZhbHVlOiB2YWx1ZSwgcmVhZG9ubHk6IFwiMVwifSlcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXSlcbiAgICAgICAgXSlcbiAgICAgICkpLFxuICAgIH07XG4gIH0pO1xuXG4gIGxldCBJbnRlbnQgPSBDeWNsZS5jcmVhdGVJbnRlbnQoVXNlciA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNoYW5nZVZhbHVlJDogVXNlci5ldmVudCQoXCJbdHlwZT1yYW5nZV1cIiwgXCJpbnB1dFwiKVxuICAgICAgICAubWFwKGV2ZW50ID0+IHBhcnNlSW50KGV2ZW50LnRhcmdldC52YWx1ZSkpLFxuICAgIH07XG4gIH0pO1xuXG4gIFVzZXIuaW5qZWN0KFZpZXcpLmluamVjdChNb2RlbCkuaW5qZWN0KEludGVudCwgUHJvcHMpWzBdLmluamVjdChVc2VyKTtcblxuICByZXR1cm4ge1xuICAgIGNoYW5nZVZhbHVlJDogSW50ZW50LmdldChcImNoYW5nZVZhbHVlJFwiKVxuICAgICAgLmNvbWJpbmVMYXRlc3QoTW9kZWwuZ2V0KFwiaWQkXCIpLCAodmFsdWUsIGlkKSA9PiAoe2lkLCB2YWx1ZX0pKSxcbiAgfTtcbn0pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHNvcnRCeSA9IHJlcXVpcmUoXCJsb2Rhc2guc29ydGJ5XCIpO1xubGV0IHZhbHVlcyA9IHJlcXVpcmUoXCJsb2Rhc2gudmFsdWVzXCIpO1xubGV0IEN5Y2xlID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5sZXQge1J4LCBofSA9IEN5Y2xlO1xubGV0IFNsaWRlciA9IHJlcXVpcmUoXCIuL3NsaWRlclwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KE1vZGVsID0+IHtcbiAgbGV0IHN0YXRlJCA9IE1vZGVsLmdldChcInN0YXRlJFwiKTtcbiAgcmV0dXJuIHtcbiAgICB2dHJlZSQ6IHN0YXRlJC5tYXAoaXRlbXMgPT4gKFxuICAgICAgaCgnZGl2Jywge2NsYXNzTmFtZTogXCJzbGlkZXJzXCJ9LCBbXG4gICAgICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgICAgICBzb3J0QnkodmFsdWVzKGl0ZW1zKSwgaXRlbSA9PiBpdGVtLmlkKS5tYXAoaXRlbSA9PlxuICAgICAgICAgICAgaCgnU2xpZGVyJywge2lkOiBpdGVtLmlkLCB2YWx1ZTogaXRlbS52YWx1ZSwga2V5OiBpdGVtLmlkfSlcbiAgICAgICAgICApXG4gICAgICAgIF0pXG4gICAgICBdKVxuICAgICkpLFxuICB9O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldzsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiYmFiZWwvcG9seWZpbGxcIik7XG5cbi8vIFNISU1TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeH0gPSBDeWNsZTtcblxuQ3ljbGUubGF0ZXN0ID0gZnVuY3Rpb24gKERhdGFOb2RlLCBrZXlzLCByZXN1bHRTZWxlY3Rvcikge1xuICBsZXQgb2JzZXJ2YWJsZXMgPSBrZXlzLm1hcChrZXkgPT4gRGF0YU5vZGUuZ2V0KGtleSkpO1xuICBsZXQgYXJncyA9IG9ic2VydmFibGVzLmNvbmNhdChbXG4gICAgZnVuY3Rpb24gc2VsZWN0b3IoLi4ubGlzdCkge1xuICAgICAgbGV0IGl0ZW0gPSBrZXlzLnJlZHVjZSgoaXRlbSwga2V5KSA9PiB7XG4gICAgICAgIGl0ZW1ba2V5LnNsaWNlKDAsIC0xKV0gPSBsaXN0W2tleXMuaW5kZXhPZihrZXkpXTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9LCB7fSk7XG4gICAgICByZXR1cm4gcmVzdWx0U2VsZWN0b3IoaXRlbSk7XG4gICAgfVxuICBdKTtcbiAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuY29tYmluZUxhdGVzdC5hcHBseShudWxsLCBhcmdzKTtcbn07XG5cbmNvbnNvbGUuc3B5ID0gZnVuY3Rpb24gc3B5KC4uLnBhcmFtcykge1xuICByZXR1cm4gY29uc29sZS5sb2cuYmluZChjb25zb2xlLCAuLi5wYXJhbXMpO1xufTsiLCIvKipcbiAqIGxvZGFzaCAzLjAuMCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuNy4wIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xudmFyIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnbG9kYXNoLl9pc2l0ZXJhdGVlY2FsbCcpO1xuXG4vKiogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBudW1iZXJzIChwb3NpdGl2ZSBhbmQvb3IgbmVnYXRpdmUpIHByb2dyZXNzaW5nIGZyb21cbiAqIGBzdGFydGAgdXAgdG8sIGJ1dCBub3QgaW5jbHVkaW5nLCBgZW5kYC4gSWYgYHN0YXJ0YCBpcyBsZXNzIHRoYW4gYGVuZGAgYVxuICogemVyby1sZW5ndGggcmFuZ2UgaXMgY3JlYXRlZCB1bmxlc3MgYSBuZWdhdGl2ZSBgc3RlcGAgaXMgc3BlY2lmaWVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0eVxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgb2YgdGhlIHJhbmdlLlxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBUaGUgZW5kIG9mIHRoZSByYW5nZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlcD0xXSBUaGUgdmFsdWUgdG8gaW5jcmVtZW50IG9yIGRlY3JlbWVudCBieS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIG51bWJlcnMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ucmFuZ2UoNCk7XG4gKiAvLyA9PiBbMCwgMSwgMiwgM11cbiAqXG4gKiBfLnJhbmdlKDEsIDUpO1xuICogLy8gPT4gWzEsIDIsIDMsIDRdXG4gKlxuICogXy5yYW5nZSgwLCAyMCwgNSk7XG4gKiAvLyA9PiBbMCwgNSwgMTAsIDE1XVxuICpcbiAqIF8ucmFuZ2UoMCwgLTQsIC0xKTtcbiAqIC8vID0+IFswLCAtMSwgLTIsIC0zXVxuICpcbiAqIF8ucmFuZ2UoMSwgNCwgMCk7XG4gKiAvLyA9PiBbMSwgMSwgMV1cbiAqXG4gKiBfLnJhbmdlKDApO1xuICogLy8gPT4gW11cbiAqL1xuZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIGVuZCwgc3RlcCkge1xuICBpZiAoc3RlcCAmJiBpc0l0ZXJhdGVlQ2FsbChzdGFydCwgZW5kLCBzdGVwKSkge1xuICAgIGVuZCA9IHN0ZXAgPSBudWxsO1xuICB9XG4gIHN0YXJ0ID0gK3N0YXJ0IHx8IDA7XG4gIHN0ZXAgPSBzdGVwID09IG51bGwgPyAxIDogKCtzdGVwIHx8IDApO1xuXG4gIGlmIChlbmQgPT0gbnVsbCkge1xuICAgIGVuZCA9IHN0YXJ0O1xuICAgIHN0YXJ0ID0gMDtcbiAgfSBlbHNlIHtcbiAgICBlbmQgPSArZW5kIHx8IDA7XG4gIH1cbiAgLy8gVXNlIGBBcnJheShsZW5ndGgpYCBzbyBlbmdpbmVzIGxpa2UgQ2hha3JhIGFuZCBWOCBhdm9pZCBzbG93ZXIgbW9kZXMuXG4gIC8vIFNlZSBodHRwczovL3lvdXR1LmJlL1hBcUlwR1U4WlprI3Q9MTdtMjVzIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGNlaWwoKGVuZCAtIHN0YXJ0KSAvIChzdGVwIHx8IDEpKSwgMCksXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IHN0YXJ0O1xuICAgIHN0YXJ0ICs9IHN0ZXA7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByYW5nZTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC40IChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjIgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogVXNlZCBhcyB0aGUgbWF4aW11bSBsZW5ndGggb2YgYW4gYXJyYXktbGlrZSB2YWx1ZS5cbiAqIFNlZSB0aGUgW0VTIHNwZWNdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSArdmFsdWU7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGg7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBwcm92aWRlZCBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInKSB7XG4gICAgdmFyIGxlbmd0aCA9IG9iamVjdC5sZW5ndGgsXG4gICAgICAgIHByZXJlcSA9IGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChpbmRleCwgbGVuZ3RoKTtcbiAgfSBlbHNlIHtcbiAgICBwcmVyZXEgPSB0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdDtcbiAgfVxuICBpZiAocHJlcmVxKSB7XG4gICAgdmFyIG90aGVyID0gb2JqZWN0W2luZGV4XTtcbiAgICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gKHZhbHVlID09PSBvdGhlcikgOiAob3RoZXIgIT09IG90aGVyKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyBiYXNlZCBvbiBFUyBgVG9MZW5ndGhgLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgbGFuZ3VhZ2UgdHlwZSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqICoqTm90ZToqKiBTZWUgdGhlIFtFUzUgc3BlY10oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdHlwZSA9PSAnZnVuY3Rpb24nIHx8ICh2YWx1ZSAmJiB0eXBlID09ICdvYmplY3QnKSB8fCBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcbiJdfQ==
