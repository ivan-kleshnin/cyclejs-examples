(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("./shims");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// APP =============================================================================================
var Model = Cycle.createModel(function () {
  var started = Date.now();
  return {
    msSinceStart$: Rx.Observable.interval(100).map(function () {
      return Date.now() - started;
    })
  };
});

var View = Cycle.createView(function (Model) {
  return {
    vtree$: Model.get("msSinceStart$").map(function (msSinceStart) {
      var timeDelta = (msSinceStart / 1000).toFixed(1);
      return h("div", null, ["Started ", timeDelta, " seconds ago"]);
    }) };
});

var User = Cycle.createDOMUser("main");

User.inject(View).inject(Model);

},{"./shims":2,"cyclejs":"cyclejs"}],2:[function(require,module,exports){
"use strict";

require("babel/polyfill");

},{"babel/polyfill":"babel/polyfill"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL3NjcmlwdHMvYXBwLmpzIiwiYnVpbGQvc2NyaXB0cy9zaGltcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0NBLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQixJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUIsRUFBRSxHQUFPLEtBQUssQ0FBZCxFQUFFO0lBQUUsQ0FBQyxHQUFJLEtBQUssQ0FBVixDQUFDOzs7QUFHVixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLFlBQU07QUFDbEMsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3pCLFNBQU87QUFDTCxpQkFBYSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUN2QyxHQUFHLENBQUM7YUFBTSxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsT0FBTztLQUFBLENBQUM7R0FDbkMsQ0FBQztDQUNILENBQUMsQ0FBQzs7QUFFSCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQ25DLFNBQU87QUFDTCxVQUFNLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxZQUFZLEVBQUk7QUFDckQsVUFBSSxTQUFTLEdBQUcsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBLENBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELGFBQ0UsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FDYixVQUFVLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FDdEMsQ0FBQyxDQUNGO0tBQ0gsQ0FBQyxFQUNILENBQUM7Q0FDSCxDQUFDLENBQUM7O0FBRUgsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7O0FDN0JoQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiLi9zaGltc1wiKTtcbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcblxuLy8gQVBQID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IE1vZGVsID0gQ3ljbGUuY3JlYXRlTW9kZWwoKCkgPT4ge1xuICBsZXQgc3RhcnRlZCA9IERhdGUubm93KCk7XG4gIHJldHVybiB7XG4gICAgbXNTaW5jZVN0YXJ0JDogUnguT2JzZXJ2YWJsZS5pbnRlcnZhbCgxMDApXG4gICAgICAubWFwKCgpID0+IERhdGUubm93KCkgLSBzdGFydGVkKVxuICB9O1xufSk7XG5cbmxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiB7XG4gIHJldHVybiB7XG4gICAgdnRyZWUkOiBNb2RlbC5nZXQoXCJtc1NpbmNlU3RhcnQkXCIpLm1hcChtc1NpbmNlU3RhcnQgPT4ge1xuICAgICAgbGV0IHRpbWVEZWx0YSA9IChtc1NpbmNlU3RhcnQgLyAxMDAwKS50b0ZpeGVkKDEpO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgaCgnZGl2JywgbnVsbCwgW1xuICAgICAgICAgIFwiU3RhcnRlZCBcIiwgdGltZURlbHRhLCBcIiBzZWNvbmRzIGFnb1wiXG4gICAgICAgIF0pXG4gICAgICApO1xuICAgIH0pLFxuICB9O1xufSk7XG5cbmxldCBVc2VyID0gQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIik7XG5cblVzZXIuaW5qZWN0KFZpZXcpLmluamVjdChNb2RlbCk7IiwicmVxdWlyZShcImJhYmVsL3BvbHlmaWxsXCIpOyJdfQ==
