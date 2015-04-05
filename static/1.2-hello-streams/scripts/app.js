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
 * 6. Eager Observable input is impossible to mock for tests
 * 7. So it"s conventional to wrap every Node in `createStream`
 * 8. It will also make easier to add / remove Nodes later
 * 9. MVII is just a convenient preset, not a requirement
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
var changeName$ = createStream(function (interactions$) {
  return interactions$.choose("[name=name]", "input").map(function (event) {
    return event.target.value;
  });
});

// [INTENT] <- MODEL ===============================================================================
var name$ = createStream(function (changeName$) {
  return changeName$.startWith("");
});

// [MODEL] <- VIEW =================================================================================
var vtree$ = createStream(function (name$) {
  return name$.map(function (name) {
    return h("div", null, [h("div", { className: "form-group" }, [h("label", null, ["Name:"]), h("input", { name: "name", className: "form-control", type: "text" })]), h("hr", null), h("h1", null, ["Hello ", name, "!"])]);
  });
});

// CYCLE ===========================================================================================
interactions$.inject(vtree$).inject(name$).inject(changeName$).inject(interactions$);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC8xLjItaGVsbG8tc3RyZWFtcy9zY3JpcHRzL2FwcC5qcyIsImJ1aWxkL2NvbW1vbi9zY3JpcHRzL3BvbHlmaWxscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNjQSxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzs7ZUFDTixPQUFPLENBQUMsU0FBUyxDQUFDOztJQUFqRCxFQUFFLFlBQUYsRUFBRTtJQUFFLENBQUMsWUFBRCxDQUFDO0lBQUUsWUFBWSxZQUFaLFlBQVk7SUFBRSxNQUFNLFlBQU4sTUFBTTs7O0FBR2hDLElBQUksYUFBYSxHQUFHLFlBQVksQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUN6QyxTQUFPLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDO0NBQzdDLENBQUMsQ0FBQzs7O0FBR0gsSUFBSSxXQUFXLEdBQUcsWUFBWSxDQUFDLFVBQUEsYUFBYSxFQUFJO0FBQzlDLFNBQU8sYUFBYSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztXQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSztHQUFBLENBQUMsQ0FBQztDQUN0RixDQUFDLENBQUM7OztBQUdILElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxVQUFBLFdBQVcsRUFBSTtBQUN0QyxTQUFPLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7Q0FDbEMsQ0FBQyxDQUFDOzs7QUFHSCxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDakMsU0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3ZCLFdBQ0UsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FDYixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBQyxFQUFFLENBQ2xDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFDM0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FDcEUsQ0FBQyxFQUNGLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2IsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQ3JDLENBQUMsQ0FDRjtHQUNILENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQzs7O0FBR0gsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7Ozs7O0FDaERyRixPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7Ozs7Ozs7QUFRMUIsT0FBTyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsR0FBWTs7O29DQUFSLE1BQU07QUFBTixVQUFNOzs7QUFDbEMsU0FBTyxnQkFBQSxPQUFPLENBQUMsR0FBRyxFQUFDLElBQUksTUFBQSxnQkFBQyxPQUFPLFNBQUssTUFBTSxFQUFDLENBQUM7Q0FDN0MsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIDEuIEV2ZXJ5dGhpbmcgaXMgUnguT2JzZXJ2YWJsZSAobmVhcmx5KVxuICogMi4gT2JzZXJ2YWJsZXMgY2FuIGJlIGNsYXNzaWZpZWQgaW50byBOb2Rlc1xuICogMy4gQ29tbW9uIE5vZGVzIGFyZTpcbiAqICAgIE1vZGVsIC8gVmlldyAvIEludGVudCAvIEludGVyYWN0aW9ucyAoTVZJSSlcbiAqIDQuIERlcGVuZGVuY2llcyBhcmUgY2lyY3VsYXI6XG4gKiAgICBJbnRlcmFjdGlvbnMgPC0gSW50ZW50IDwtIE1vZGVsIDwtIFZpZXcgPC0gSW50ZXJhY3Rpb25zXG4gKiA1LiBDeWNsZUpTIHByb3ZpZGVzIGBpbmplY3RgIG1ldGhvZCB0byBzb2x2ZSB0aGlzXG4gKiA2LiBFYWdlciBPYnNlcnZhYmxlIGlucHV0IGlzIGltcG9zc2libGUgdG8gbW9jayBmb3IgdGVzdHNcbiAqIDcuIFNvIGl0XCJzIGNvbnZlbnRpb25hbCB0byB3cmFwIGV2ZXJ5IE5vZGUgaW4gYGNyZWF0ZVN0cmVhbWBcbiAqIDguIEl0IHdpbGwgYWxzbyBtYWtlIGVhc2llciB0byBhZGQgLyByZW1vdmUgTm9kZXMgbGF0ZXJcbiAqIDkuIE1WSUkgaXMganVzdCBhIGNvbnZlbmllbnQgcHJlc2V0LCBub3QgYSByZXF1aXJlbWVudFxuICovXG4vLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiLi4vLi4vY29tbW9uL3NjcmlwdHMvcG9seWZpbGxzXCIpO1xubGV0IHtSeCwgaCwgY3JlYXRlU3RyZWFtLCByZW5kZXJ9ID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5cbi8vIElOVEVSQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpbnRlcmFjdGlvbnMkID0gY3JlYXRlU3RyZWFtKHZ0cmVlJCA9PiB7XG4gIHJldHVybiByZW5kZXIodnRyZWUkLCBcIm1haW5cIikuaW50ZXJhY3Rpb25zJDtcbn0pO1xuXG4vLyBbSU5URVJBQ1RJT05TXSA8LSBJTlRFTlQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgY2hhbmdlTmFtZSQgPSBjcmVhdGVTdHJlYW0oaW50ZXJhY3Rpb25zJCA9PiB7XG4gIHJldHVybiBpbnRlcmFjdGlvbnMkLmNob29zZShcIltuYW1lPW5hbWVdXCIsIFwiaW5wdXRcIikubWFwKGV2ZW50ID0+IGV2ZW50LnRhcmdldC52YWx1ZSk7XG59KTtcblxuLy8gW0lOVEVOVF0gPC0gTU9ERUwgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IG5hbWUkID0gY3JlYXRlU3RyZWFtKGNoYW5nZU5hbWUkID0+IHtcbiAgcmV0dXJuIGNoYW5nZU5hbWUkLnN0YXJ0V2l0aChcIlwiKTtcbn0pO1xuXG4vLyBbTU9ERUxdIDwtIFZJRVcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgdnRyZWUkID0gY3JlYXRlU3RyZWFtKG5hbWUkID0+IHtcbiAgcmV0dXJuIG5hbWUkLm1hcChuYW1lID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgaCgnZGl2JywgbnVsbCwgW1xuICAgICAgICBoKCdkaXYnLCB7Y2xhc3NOYW1lOiBcImZvcm0tZ3JvdXBcIn0sIFtcbiAgICAgICAgICBoKCdsYWJlbCcsIG51bGwsIFtcIk5hbWU6XCJdKSxcbiAgICAgICAgICBoKCdpbnB1dCcsIHtuYW1lOiBcIm5hbWVcIiwgY2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwiLCB0eXBlOiBcInRleHRcIn0pXG4gICAgICAgIF0pLFxuICAgICAgICBoKCdocicsIG51bGwpLFxuICAgICAgICBoKCdoMScsIG51bGwsIFtcIkhlbGxvIFwiLCBuYW1lLCBcIiFcIl0pXG4gICAgICBdKVxuICAgICk7XG4gIH0pO1xufSk7XG5cbi8vIENZQ0xFID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmludGVyYWN0aW9ucyQuaW5qZWN0KHZ0cmVlJCkuaW5qZWN0KG5hbWUkKS5pbmplY3QoY2hhbmdlTmFtZSQpLmluamVjdChpbnRlcmFjdGlvbnMkKTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnJlcXVpcmUoXCJiYWJlbC9wb2x5ZmlsbFwiKTtcblxuLy8gU0hJTVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLyoqXG4gKiBFeGFtcGxlOiBgJG9ic2VydmFibGUudGFwKGNvbnNvbGUuc3B5KFwiSGVyZVwiKSkudGFwKGNvbnNvbGUuc3B5KFwiQW5kIFRoZXJlIVwiKWBcbiAqIEBwYXJhbSBwYXJhbXMgdG8gYmUgbG9nZ2VkIGluIGZyb250IG9mIGFjdHVhbCBkYXRhXG4gKiBAcmV0dXJuIHZvaWRcbiAqL1xuY29uc29sZS5zcHkgPSBmdW5jdGlvbiBzcHkoLi4ucGFyYW1zKSB7XG4gIHJldHVybiBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUsIC4uLnBhcmFtcyk7XG59O1xuXG4vL2xldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xuLy9sZXQge1J4fSA9IEN5Y2xlO1xuXG4vL0N5Y2xlLmxhdGVzdCA9IGZ1bmN0aW9uIChEYXRhTm9kZSwga2V5cywgcmVzdWx0U2VsZWN0b3IpIHtcbi8vICBsZXQgb2JzZXJ2YWJsZXMgPSBrZXlzLm1hcChrZXkgPT4gRGF0YU5vZGUuZ2V0KGtleSkpO1xuLy8gIGxldCBhcmdzID0gb2JzZXJ2YWJsZXMuY29uY2F0KFtcbi8vICAgIGZ1bmN0aW9uIHNlbGVjdG9yKC4uLmxpc3QpIHtcbi8vICAgICAgbGV0IGl0ZW0gPSBrZXlzLnJlZHVjZSgoaXRlbSwga2V5KSA9PiB7XG4vLyAgICAgICAgaXRlbVtrZXkuc2xpY2UoMCwgLTEpXSA9IGxpc3Rba2V5cy5pbmRleE9mKGtleSldO1xuLy8gICAgICAgIHJldHVybiBpdGVtO1xuLy8gICAgICB9LCB7fSk7XG4vLyAgICAgIHJldHVybiByZXN1bHRTZWxlY3RvcihpdGVtKTtcbi8vICAgIH1cbi8vICBdKTtcbi8vICByZXR1cm4gUnguT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0LmFwcGx5KG51bGwsIGFyZ3MpO1xuLy99O1xuIl19
