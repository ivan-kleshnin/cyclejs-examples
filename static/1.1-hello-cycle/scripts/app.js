(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

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

// CYCLE ===========================================================================================
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC8xLjEtaGVsbG8tY3ljbGUvc2NyaXB0cy9hcHAuanMiLCJidWlsZC9jb21tb24vc2NyaXB0cy9wb2x5ZmlsbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzs7ZUFDTixPQUFPLENBQUMsU0FBUyxDQUFDOztJQUFqRCxFQUFFLFlBQUYsRUFBRTtJQUFFLENBQUMsWUFBRCxDQUFDO0lBQUUsWUFBWSxZQUFaLFlBQVk7SUFBRSxNQUFNLFlBQU4sTUFBTTs7O0FBR2hDLElBQUksYUFBYSxHQUFHLFlBQVksQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUN6QyxTQUFPLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDO0NBQzdDLENBQUMsQ0FBQzs7O0FBR0gsSUFBSSxXQUFXLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztTQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSztDQUFBLENBQUMsQ0FBQzs7O0FBR2hHLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7OztBQUd0QyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQzdCLFNBQ0UsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FDYixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBQyxFQUFFLENBQ2xDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFDM0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FDcEUsQ0FBQyxFQUNGLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2IsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQ3JDLENBQUMsQ0FDRjtDQUNILENBQUMsQ0FBQzs7O0FBR0gsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7O0FDN0I3QixPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7Ozs7Ozs7QUFRMUIsT0FBTyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsR0FBWTs7O29DQUFSLE1BQU07QUFBTixVQUFNOzs7QUFDbEMsU0FBTyxnQkFBQSxPQUFPLENBQUMsR0FBRyxFQUFDLElBQUksTUFBQSxnQkFBQyxPQUFPLFNBQUssTUFBTSxFQUFDLENBQUM7Q0FDN0MsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiLi4vLi4vY29tbW9uL3NjcmlwdHMvcG9seWZpbGxzXCIpO1xubGV0IHtSeCwgaCwgY3JlYXRlU3RyZWFtLCByZW5kZXJ9ID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5cbi8vIElOVEVSQUNUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBpbnRlcmFjdGlvbnMkID0gY3JlYXRlU3RyZWFtKHZ0cmVlJCA9PiB7XG4gIHJldHVybiByZW5kZXIodnRyZWUkLCBcIm1haW5cIikuaW50ZXJhY3Rpb25zJDtcbn0pO1xuXG4vLyBbSU5URVJBQ1RJT05TXSA8LSBJTlRFTlQgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgY2hhbmdlTmFtZSQgPSBpbnRlcmFjdGlvbnMkLmNob29zZShcIltuYW1lPW5hbWVdXCIsIFwiaW5wdXRcIikubWFwKGV2ZW50ID0+IGV2ZW50LnRhcmdldC52YWx1ZSk7XG5cbi8vIFtJTlRFTlRdIDwtIE1PREVMID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBuYW1lJCA9IGNoYW5nZU5hbWUkLnN0YXJ0V2l0aChcIlwiKTtcblxuLy8gW01PREVMXSA8LSBWSUVXID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHZ0cmVlJCA9IG5hbWUkLm1hcChuYW1lID0+IHtcbiAgcmV0dXJuIChcbiAgICBoKCdkaXYnLCBudWxsLCBbXG4gICAgICBoKCdkaXYnLCB7Y2xhc3NOYW1lOiBcImZvcm0tZ3JvdXBcIn0sIFtcbiAgICAgICAgaCgnbGFiZWwnLCBudWxsLCBbXCJOYW1lOlwiXSksXG4gICAgICAgIGgoJ2lucHV0Jywge25hbWU6IFwibmFtZVwiLCBjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCIsIHR5cGU6IFwidGV4dFwifSlcbiAgICAgIF0pLFxuICAgICAgaCgnaHInLCBudWxsKSxcbiAgICAgIGgoJ2gxJywgbnVsbCwgW1wiSGVsbG8gXCIsIG5hbWUsIFwiIVwiXSlcbiAgICBdKVxuICApO1xufSk7XG5cbi8vIENZQ0xFID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmludGVyYWN0aW9ucyQuaW5qZWN0KHZ0cmVlJCk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiYmFiZWwvcG9seWZpbGxcIik7XG5cbi8vIFNISU1TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8qKlxuICogRXhhbXBsZTogYCRvYnNlcnZhYmxlLnRhcChjb25zb2xlLnNweShcIkhlcmVcIikpLnRhcChjb25zb2xlLnNweShcIkFuZCBUaGVyZSFcIilgXG4gKiBAcGFyYW0gcGFyYW1zIHRvIGJlIGxvZ2dlZCBpbiBmcm9udCBvZiBhY3R1YWwgZGF0YVxuICogQHJldHVybiB2b2lkXG4gKi9cbmNvbnNvbGUuc3B5ID0gZnVuY3Rpb24gc3B5KC4uLnBhcmFtcykge1xuICByZXR1cm4gY29uc29sZS5sb2cuYmluZChjb25zb2xlLCAuLi5wYXJhbXMpO1xufTtcblxuLy9sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbi8vbGV0IHtSeH0gPSBDeWNsZTtcblxuLy9DeWNsZS5sYXRlc3QgPSBmdW5jdGlvbiAoRGF0YU5vZGUsIGtleXMsIHJlc3VsdFNlbGVjdG9yKSB7XG4vLyAgbGV0IG9ic2VydmFibGVzID0ga2V5cy5tYXAoa2V5ID0+IERhdGFOb2RlLmdldChrZXkpKTtcbi8vICBsZXQgYXJncyA9IG9ic2VydmFibGVzLmNvbmNhdChbXG4vLyAgICBmdW5jdGlvbiBzZWxlY3RvciguLi5saXN0KSB7XG4vLyAgICAgIGxldCBpdGVtID0ga2V5cy5yZWR1Y2UoKGl0ZW0sIGtleSkgPT4ge1xuLy8gICAgICAgIGl0ZW1ba2V5LnNsaWNlKDAsIC0xKV0gPSBsaXN0W2tleXMuaW5kZXhPZihrZXkpXTtcbi8vICAgICAgICByZXR1cm4gaXRlbTtcbi8vICAgICAgfSwge30pO1xuLy8gICAgICByZXR1cm4gcmVzdWx0U2VsZWN0b3IoaXRlbSk7XG4vLyAgICB9XG4vLyAgXSk7XG4vLyAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuY29tYmluZUxhdGVzdC5hcHBseShudWxsLCBhcmdzKTtcbi8vfTtcbiJdfQ==
