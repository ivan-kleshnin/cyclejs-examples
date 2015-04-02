(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("../../common/scripts/shims");
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

},{"../../common/scripts/shims":2,"cyclejs":"cyclejs"}],2:[function(require,module,exports){
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

},{"babel/polyfill":"babel/polyfill","cyclejs":"cyclejs"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC8xLjEtdGltZXIvc2NyaXB0cy9hcHAuanMiLCJidWlsZC9jb21tb24vc2NyaXB0cy9zaGltcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0NBLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3RDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQixFQUFFLEdBQU8sS0FBSyxDQUFkLEVBQUU7SUFBRSxDQUFDLEdBQUksS0FBSyxDQUFWLENBQUM7OztBQUdWLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsWUFBTTtBQUNsQyxNQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekIsU0FBTztBQUNMLGlCQUFhLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQ3ZDLEdBQUcsQ0FBQzthQUFNLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPO0tBQUEsQ0FBQztHQUNuQyxDQUFDO0NBQ0gsQ0FBQyxDQUFDOztBQUVILElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDbkMsU0FBTztBQUNMLFVBQU0sRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFlBQVksRUFBSTtBQUNyRCxVQUFJLFNBQVMsR0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUEsQ0FBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakQsYUFDRSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUNiLFVBQVUsRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUN0QyxDQUFDLENBQ0Y7S0FDSCxDQUFDLEVBQ0gsQ0FBQztDQUNILENBQUMsQ0FBQzs7QUFFSCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV2QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Ozs7O0FDNUJoQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7O0FBRzFCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQixFQUFFLEdBQUksS0FBSyxDQUFYLEVBQUU7O0FBRVAsS0FBSyxDQUFDLE1BQU0sR0FBRyxVQUFVLFFBQVEsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFO0FBQ3ZELE1BQUksV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHO1dBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7R0FBQSxDQUFDLENBQUM7QUFDckQsTUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUM1QixTQUFTLFFBQVEsR0FBVTtzQ0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQ3ZCLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFLO0FBQ3BDLFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqRCxhQUFPLElBQUksQ0FBQztLQUNiLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDUCxXQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM3QixDQUNGLENBQUMsQ0FBQztBQUNILFNBQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztDQUN0RCxDQUFDOztBQUVGLE9BQU8sQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEdBQVk7OztvQ0FBUixNQUFNO0FBQU4sVUFBTTs7O0FBQ2xDLFNBQU8sZ0JBQUEsT0FBTyxDQUFDLEdBQUcsRUFBQyxJQUFJLE1BQUEsZ0JBQUMsT0FBTyxTQUFLLE1BQU0sRUFBQyxDQUFDO0NBQzdDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxucmVxdWlyZShcIi4uLy4uL2NvbW1vbi9zY3JpcHRzL3NoaW1zXCIpO1xubGV0IEN5Y2xlID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5sZXQge1J4LCBofSA9IEN5Y2xlO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgTW9kZWwgPSBDeWNsZS5jcmVhdGVNb2RlbCgoKSA9PiB7XG4gIGxldCBzdGFydGVkID0gRGF0ZS5ub3coKTtcbiAgcmV0dXJuIHtcbiAgICBtc1NpbmNlU3RhcnQkOiBSeC5PYnNlcnZhYmxlLmludGVydmFsKDEwMClcbiAgICAgIC5tYXAoKCkgPT4gRGF0ZS5ub3coKSAtIHN0YXJ0ZWQpXG4gIH07XG59KTtcblxubGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KE1vZGVsID0+IHtcbiAgcmV0dXJuIHtcbiAgICB2dHJlZSQ6IE1vZGVsLmdldChcIm1zU2luY2VTdGFydCRcIikubWFwKG1zU2luY2VTdGFydCA9PiB7XG4gICAgICBsZXQgdGltZURlbHRhID0gKG1zU2luY2VTdGFydCAvIDEwMDApLnRvRml4ZWQoMSk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBoKCdkaXYnLCBudWxsLCBbXG4gICAgICAgICAgXCJTdGFydGVkIFwiLCB0aW1lRGVsdGEsIFwiIHNlY29uZHMgYWdvXCJcbiAgICAgICAgXSlcbiAgICAgICk7XG4gICAgfSksXG4gIH07XG59KTtcblxubGV0IFVzZXIgPSBDeWNsZS5jcmVhdGVET01Vc2VyKFwibWFpblwiKTtcblxuVXNlci5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiYmFiZWwvcG9seWZpbGxcIik7XG5cbi8vIFNISU1TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeH0gPSBDeWNsZTtcblxuQ3ljbGUubGF0ZXN0ID0gZnVuY3Rpb24gKERhdGFOb2RlLCBrZXlzLCByZXN1bHRTZWxlY3Rvcikge1xuICBsZXQgb2JzZXJ2YWJsZXMgPSBrZXlzLm1hcChrZXkgPT4gRGF0YU5vZGUuZ2V0KGtleSkpO1xuICBsZXQgYXJncyA9IG9ic2VydmFibGVzLmNvbmNhdChbXG4gICAgZnVuY3Rpb24gc2VsZWN0b3IoLi4ubGlzdCkge1xuICAgICAgbGV0IGl0ZW0gPSBrZXlzLnJlZHVjZSgoaXRlbSwga2V5KSA9PiB7XG4gICAgICAgIGl0ZW1ba2V5LnNsaWNlKDAsIC0xKV0gPSBsaXN0W2tleXMuaW5kZXhPZihrZXkpXTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9LCB7fSk7XG4gICAgICByZXR1cm4gcmVzdWx0U2VsZWN0b3IoaXRlbSk7XG4gICAgfVxuICBdKTtcbiAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuY29tYmluZUxhdGVzdC5hcHBseShudWxsLCBhcmdzKTtcbn07XG5cbmNvbnNvbGUuc3B5ID0gZnVuY3Rpb24gc3B5KC4uLnBhcmFtcykge1xuICByZXR1cm4gY29uc29sZS5sb2cuYmluZChjb25zb2xlLCAuLi5wYXJhbXMpO1xufTsiXX0=
