(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * 1. Everything is Rx.Observable (nearly)
 * 2. Observables can be classified into Nodes
 * 3. Common Nodes are:
 *    Model / View / Intent / Interactions (MVII)
 * 4. Dependencies are circular:
 *    Interactions <- Intent <- Model <- View <- Interactions
 * 5. CycleJS provides `inject` method to solve this
 */
// IMPORTS =========================================================================================
require("../../common/scripts/polyfills");

var _require = require("cyclejs");

var Rx = _require.Rx;
var h = _require.h;
var createStream = _require.createStream;
var render = _require.render;

// INTERACTIONS ====================================================================================
var interactions$ = createStream(function (vtree$) {
  return render(vtree$, "main").interactions$;
});

// [INTERACTIONS] <- INTENT ========================================================================
var changeName$ = interactions$.choose("[name=name]", "input").map(function (event) {
  return event.target.value;
});

// [INTENT] <- MODEL ===============================================================================
var name$ = changeName$.startWith("");

// [MODEL] <- VIEW =================================================================================
var vtree$ = name$.map(function (name) {
  return h("div", null, [h("div", { className: "form-group" }, [h("label", null, ["Name:"]), h("input", { name: "name", className: "form-control", type: "text" })]), h("hr", null), h("h1", null, ["Hello ", name, "!"])]);
});

// [VTREE] <- INTERACTIONS =========================================================================
interactions$.inject(vtree$);

},{"../../common/scripts/polyfills":2,"cyclejs":"cyclejs"}],2:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("babel/polyfill");

// SHIMS ===========================================================================================
/**
 * Example: `$observable.tap(console.spy("Here")).tap(console.spy("And There!")`
 * @param params to be logged in front of actual data
 * @return void
 */
console.spy = function spy() {
  var _console$log;

  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  return (_console$log = console.log).bind.apply(_console$log, [console].concat(params));
};

//let Cycle = require("cyclejs");
//let {Rx} = Cycle;

//Cycle.latest = function (DataNode, keys, resultSelector) {
//  let observables = keys.map(key => DataNode.get(key));
//  let args = observables.concat([
//    function selector(...list) {
//      let item = keys.reduce((item, key) => {
//        item[key.slice(0, -1)] = list[keys.indexOf(key)];
//        return item;
//      }, {});
//      return resultSelector(item);
//    }
//  ]);
//  return Rx.Observable.combineLatest.apply(null, args);
//};

},{"babel/polyfill":"babel/polyfill"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC8xLjEtaGVsbG8tY3ljbGUvc2NyaXB0cy9hcHAuanMiLCJidWlsZC9jb21tb24vc2NyaXB0cy9wb2x5ZmlsbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7QUNVQSxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzs7ZUFDTixPQUFPLENBQUMsU0FBUyxDQUFDOztJQUFqRCxFQUFFLFlBQUYsRUFBRTtJQUFFLENBQUMsWUFBRCxDQUFDO0lBQUUsWUFBWSxZQUFaLFlBQVk7SUFBRSxNQUFNLFlBQU4sTUFBTTs7O0FBR2hDLElBQUksYUFBYSxHQUFHLFlBQVksQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUN6QyxTQUFPLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDO0NBQzdDLENBQUMsQ0FBQzs7O0FBR0gsSUFBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztTQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSztDQUFBLENBQUMsQ0FBQzs7O0FBR2hHLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7OztBQUd0QyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQzdCLFNBQ0UsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FDYixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBQyxFQUFFLENBQ2xDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFDM0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FDcEUsQ0FBQyxFQUNGLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2IsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQ3JDLENBQUMsQ0FDRjtDQUNILENBQUMsQ0FBQzs7O0FBR0gsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7O0FDdEM3QixPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7Ozs7Ozs7QUFRMUIsT0FBTyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsR0FBWTs7O29DQUFSLE1BQU07QUFBTixVQUFNOzs7QUFDbEMsU0FBTyxnQkFBQSxPQUFPLENBQUMsR0FBRyxFQUFDLElBQUksTUFBQSxnQkFBQyxPQUFPLFNBQUssTUFBTSxFQUFDLENBQUM7Q0FDN0MsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIDEuIEV2ZXJ5dGhpbmcgaXMgUnguT2JzZXJ2YWJsZSAobmVhcmx5KVxuICogMi4gT2JzZXJ2YWJsZXMgY2FuIGJlIGNsYXNzaWZpZWQgaW50byBOb2Rlc1xuICogMy4gQ29tbW9uIE5vZGVzIGFyZTpcbiAqICAgIE1vZGVsIC8gVmlldyAvIEludGVudCAvIEludGVyYWN0aW9ucyAoTVZJSSlcbiAqIDQuIERlcGVuZGVuY2llcyBhcmUgY2lyY3VsYXI6XG4gKiAgICBJbnRlcmFjdGlvbnMgPC0gSW50ZW50IDwtIE1vZGVsIDwtIFZpZXcgPC0gSW50ZXJhY3Rpb25zXG4gKiA1LiBDeWNsZUpTIHByb3ZpZGVzIGBpbmplY3RgIG1ldGhvZCB0byBzb2x2ZSB0aGlzXG4gKi9cbi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyaXB0cy9wb2x5ZmlsbHNcIik7XG5sZXQge1J4LCBoLCBjcmVhdGVTdHJlYW0sIHJlbmRlcn0gPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcblxuLy8gSU5URVJBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGludGVyYWN0aW9ucyQgPSBjcmVhdGVTdHJlYW0odnRyZWUkID0+IHtcbiAgcmV0dXJuIHJlbmRlcih2dHJlZSQsIFwibWFpblwiKS5pbnRlcmFjdGlvbnMkO1xufSk7XG5cbi8vIFtJTlRFUkFDVElPTlNdIDwtIElOVEVOVCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBjaGFuZ2VOYW1lJCA9IGludGVyYWN0aW9ucyQuY2hvb3NlKFwiW25hbWU9bmFtZV1cIiwgXCJpbnB1dFwiKS5tYXAoZXZlbnQgPT4gZXZlbnQudGFyZ2V0LnZhbHVlKTtcblxuLy8gW0lOVEVOVF0gPC0gTU9ERUwgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IG5hbWUkID0gY2hhbmdlTmFtZSQuc3RhcnRXaXRoKFwiXCIpO1xuXG4vLyBbTU9ERUxdIDwtIFZJRVcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgdnRyZWUkID0gbmFtZSQubWFwKG5hbWUgPT4ge1xuICByZXR1cm4gKFxuICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwiZm9ybS1ncm91cFwifSwgW1xuICAgICAgICBoKCdsYWJlbCcsIG51bGwsIFtcIk5hbWU6XCJdKSxcbiAgICAgICAgaCgnaW5wdXQnLCB7bmFtZTogXCJuYW1lXCIsIGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIiwgdHlwZTogXCJ0ZXh0XCJ9KVxuICAgICAgXSksXG4gICAgICBoKCdocicsIG51bGwpLFxuICAgICAgaCgnaDEnLCBudWxsLCBbXCJIZWxsbyBcIiwgbmFtZSwgXCIhXCJdKVxuICAgIF0pXG4gICk7XG59KTtcblxuLy8gW1ZUUkVFXSA8LSBJTlRFUkFDVElPTlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW50ZXJhY3Rpb25zJC5pbmplY3QodnRyZWUkKTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnJlcXVpcmUoXCJiYWJlbC9wb2x5ZmlsbFwiKTtcblxuLy8gU0hJTVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLyoqXG4gKiBFeGFtcGxlOiBgJG9ic2VydmFibGUudGFwKGNvbnNvbGUuc3B5KFwiSGVyZVwiKSkudGFwKGNvbnNvbGUuc3B5KFwiQW5kIFRoZXJlIVwiKWBcbiAqIEBwYXJhbSBwYXJhbXMgdG8gYmUgbG9nZ2VkIGluIGZyb250IG9mIGFjdHVhbCBkYXRhXG4gKiBAcmV0dXJuIHZvaWRcbiAqL1xuY29uc29sZS5zcHkgPSBmdW5jdGlvbiBzcHkoLi4ucGFyYW1zKSB7XG4gIHJldHVybiBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUsIC4uLnBhcmFtcyk7XG59O1xuXG4vL2xldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xuLy9sZXQge1J4fSA9IEN5Y2xlO1xuXG4vL0N5Y2xlLmxhdGVzdCA9IGZ1bmN0aW9uIChEYXRhTm9kZSwga2V5cywgcmVzdWx0U2VsZWN0b3IpIHtcbi8vICBsZXQgb2JzZXJ2YWJsZXMgPSBrZXlzLm1hcChrZXkgPT4gRGF0YU5vZGUuZ2V0KGtleSkpO1xuLy8gIGxldCBhcmdzID0gb2JzZXJ2YWJsZXMuY29uY2F0KFtcbi8vICAgIGZ1bmN0aW9uIHNlbGVjdG9yKC4uLmxpc3QpIHtcbi8vICAgICAgbGV0IGl0ZW0gPSBrZXlzLnJlZHVjZSgoaXRlbSwga2V5KSA9PiB7XG4vLyAgICAgICAgaXRlbVtrZXkuc2xpY2UoMCwgLTEpXSA9IGxpc3Rba2V5cy5pbmRleE9mKGtleSldO1xuLy8gICAgICAgIHJldHVybiBpdGVtO1xuLy8gICAgICB9LCB7fSk7XG4vLyAgICAgIHJldHVybiByZXN1bHRTZWxlY3RvcihpdGVtKTtcbi8vICAgIH1cbi8vICBdKTtcbi8vICByZXR1cm4gUnguT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0LmFwcGx5KG51bGwsIGFyZ3MpO1xuLy99O1xuIl19
