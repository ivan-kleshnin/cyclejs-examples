(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"cyclejs":"cyclejs"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL3NjcmlwdHMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBTyxLQUFLLENBQWQsRUFBRTtJQUFFLENBQUMsR0FBSSxLQUFLLENBQVYsQ0FBQzs7O0FBR1YsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxZQUFNO0FBQ2xDLE1BQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN6QixTQUFPO0FBQ0wsaUJBQWEsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FDdkMsR0FBRyxDQUFDO2FBQU0sSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLE9BQU87S0FBQSxDQUFDO0dBQ25DLENBQUM7Q0FDSCxDQUFDLENBQUM7O0FBRUgsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUNuQyxTQUFPO0FBQ0wsVUFBTSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUEsWUFBWSxFQUFJO0FBQ3JELFVBQUksU0FBUyxHQUFHLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQSxDQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRCxhQUNFLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQ2IsVUFBVSxFQUFFLFNBQVMsRUFBRSxjQUFjLENBQ3RDLENBQUMsQ0FDRjtLQUNILENBQUMsRUFDSCxDQUFDO0NBQ0gsQ0FBQyxDQUFDOztBQUVILElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXZDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcblxuLy8gQVBQID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IE1vZGVsID0gQ3ljbGUuY3JlYXRlTW9kZWwoKCkgPT4ge1xuICBsZXQgc3RhcnRlZCA9IERhdGUubm93KCk7XG4gIHJldHVybiB7XG4gICAgbXNTaW5jZVN0YXJ0JDogUnguT2JzZXJ2YWJsZS5pbnRlcnZhbCgxMDApXG4gICAgICAubWFwKCgpID0+IERhdGUubm93KCkgLSBzdGFydGVkKVxuICB9O1xufSk7XG5cbmxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiB7XG4gIHJldHVybiB7XG4gICAgdnRyZWUkOiBNb2RlbC5nZXQoXCJtc1NpbmNlU3RhcnQkXCIpLm1hcChtc1NpbmNlU3RhcnQgPT4ge1xuICAgICAgbGV0IHRpbWVEZWx0YSA9IChtc1NpbmNlU3RhcnQgLyAxMDAwKS50b0ZpeGVkKDEpO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgaCgnZGl2JywgbnVsbCwgW1xuICAgICAgICAgIFwiU3RhcnRlZCBcIiwgdGltZURlbHRhLCBcIiBzZWNvbmRzIGFnb1wiXG4gICAgICAgIF0pXG4gICAgICApO1xuICAgIH0pLFxuICB9O1xufSk7XG5cbmxldCBVc2VyID0gQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIik7XG5cblVzZXIuaW5qZWN0KFZpZXcpLmluamVjdChNb2RlbCk7Il19
