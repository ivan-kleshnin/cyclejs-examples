(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/1.1-timer/app.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// APP =============================================================================================
var Model = Cycle.createModel(function () {
  var started = Date.now();
  return {
    msSinceStart$: Rx.Observable.interval(100).map(function () {
      return Date.now() - started;
    }) };
});

var View = Cycle.createView(function (Model) {
  return {
    vtree$: Model.get("msSinceStart$").map(function (msSinceStart) {
      var delta = (msSinceStart / 1000).toFixed(1);
      return h("p", null, ["Started ", delta, " seconds ago"]);
    }) };
});

Cycle.createDOMUser("main").inject(View).inject(Model);

},{"cyclejs":"cyclejs"}]},{},["/Users/ivankleshnin/JavaScript/cyclejs-examples/build/1.1-timer/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC8xLjEtdGltZXIvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBTyxLQUFLLENBQWQsRUFBRTtJQUFFLENBQUMsR0FBSSxLQUFLLENBQVYsQ0FBQzs7O0FBR1YsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxZQUFNO0FBQ2xDLE1BQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN6QixTQUFPO0FBQ0wsaUJBQWEsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBTTtBQUNuRCxhQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUM7S0FDN0IsQ0FBQyxFQUNILENBQUM7Q0FDSCxDQUFDLENBQUM7O0FBRUgsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUNuQyxTQUFPO0FBQ0wsVUFBTSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsWUFBWSxFQUFJO0FBQ3JELFVBQUksS0FBSyxHQUFHLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQSxDQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QyxhQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0tBQzFELENBQUMsRUFDSCxDQUFDO0NBQ0gsQ0FBQyxDQUFDOztBQUVILEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5cbi8vIEFQUCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKCgpID0+IHtcbiAgbGV0IHN0YXJ0ZWQgPSBEYXRlLm5vdygpO1xuICByZXR1cm4ge1xuICAgIG1zU2luY2VTdGFydCQ6IFJ4Lk9ic2VydmFibGUuaW50ZXJ2YWwoMTAwKS5tYXAoKCkgPT4ge1xuICAgICAgcmV0dXJuIERhdGUubm93KCkgLSBzdGFydGVkO1xuICAgIH0pLFxuICB9O1xufSk7XG5cbmxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiB7XG4gIHJldHVybiB7XG4gICAgdnRyZWUkOiBNb2RlbC5nZXQoXCJtc1NpbmNlU3RhcnQkXCIpLm1hcChtc1NpbmNlU3RhcnQgPT4ge1xuICAgICAgbGV0IGRlbHRhID0gKG1zU2luY2VTdGFydCAvIDEwMDApLnRvRml4ZWQoMSk7XG4gICAgICByZXR1cm4gaCgncCcsIG51bGwsIFtcIlN0YXJ0ZWQgXCIsIGRlbHRhLCBcIiBzZWNvbmRzIGFnb1wiXSk7XG4gICAgfSksXG4gIH07XG59KTtcblxuQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIikuaW5qZWN0KFZpZXcpLmluamVjdChNb2RlbCk7Il19
