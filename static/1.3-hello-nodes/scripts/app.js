(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("../../common/scripts/polyfills");

var _require = require("cyclejs");

var Rx = _require.Rx;
var h = _require.h;
var createStream = _require.createStream;
var render = _require.render;

// DATA-SOURCE =====================================================================================
var input$ = Rx.Observable.fromPromise(new Promise(function (resolve, reject) {
  resolve("CycleJS");
}));

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
var name$ = createStream(function (changeName$, input$) {
  return input$.merge(changeName$).startWith("");
});

// [MODEL] <- VIEW =================================================================================
var vtree$ = createStream(function (name$) {
  return name$.map(function (name) {
    return h("div", null, [h("div", { className: "form-group" }, [h("label", null, ["Name:"]), h("input", { name: "name", className: "form-control", type: "text" })]), h("hr", null), h("h1", null, ["Hello ", name, "!"])]);
  });
});

// DATA-SINK =======================================================================================
name$.subscribe(function (name) {
  console.log(name);
});

// CYCLE ===========================================================================================
interactions$.inject(vtree$);
vtree$.inject(name$);
name$.inject(changeName$, input$);
changeName$.inject(interactions$);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC8xLjMtaGVsbG8tbm9kZXMvc2NyaXB0cy9hcHAuanMiLCJidWlsZC9jb21tb24vc2NyaXB0cy9wb2x5ZmlsbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxPQUFPLENBQUMsZ0NBQWdDLENBQUMsQ0FBQzs7ZUFDTixPQUFPLENBQUMsU0FBUyxDQUFDOztJQUFqRCxFQUFFLFlBQUYsRUFBRTtJQUFFLENBQUMsWUFBRCxDQUFDO0lBQUUsWUFBWSxZQUFaLFlBQVk7SUFBRSxNQUFNLFlBQU4sTUFBTTs7O0FBR2hDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUNwQyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDL0IsU0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0NBQ3BCLENBQUMsQ0FDSCxDQUFDOzs7QUFHRixJQUFJLGFBQWEsR0FBRyxZQUFZLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDekMsU0FBTyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQztDQUM3QyxDQUFDLENBQUM7OztBQUdILElBQUksV0FBVyxHQUFHLFlBQVksQ0FBQyxVQUFBLGFBQWEsRUFBSTtBQUM5QyxTQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7V0FBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUs7R0FBQSxDQUFDLENBQUM7Q0FDdEYsQ0FBQyxDQUFDOzs7QUFHSCxJQUFJLEtBQUssR0FBRyxZQUFZLENBQUMsVUFBQyxXQUFXLEVBQUUsTUFBTSxFQUFLO0FBQ2hELFNBQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7Q0FDaEQsQ0FBQyxDQUFDOzs7QUFHSCxJQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDakMsU0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3ZCLFdBQ0UsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FDYixDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBQyxFQUFFLENBQ2xDLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFDM0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FDcEUsQ0FBQyxFQUNGLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQ2IsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQ3JDLENBQUMsQ0FDRjtHQUNILENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQzs7O0FBR0gsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFBLElBQUksRUFBSTtBQUN0QixTQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ25CLENBQUMsQ0FBQzs7O0FBR0gsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JCLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2xDLFdBQVcsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7Ozs7OztBQ2xEbEMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Ozs7Ozs7O0FBUTFCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEdBQVk7OztvQ0FBUixNQUFNO0FBQU4sVUFBTTs7O0FBQ2xDLFNBQU8sZ0JBQUEsT0FBTyxDQUFDLEdBQUcsRUFBQyxJQUFJLE1BQUEsZ0JBQUMsT0FBTyxTQUFLLE1BQU0sRUFBQyxDQUFDO0NBQzdDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxucmVxdWlyZShcIi4uLy4uL2NvbW1vbi9zY3JpcHRzL3BvbHlmaWxsc1wiKTtcbmxldCB7UngsIGgsIGNyZWF0ZVN0cmVhbSwgcmVuZGVyfSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xuXG4vLyBEQVRBLVNPVVJDRSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgaW5wdXQkID0gUnguT2JzZXJ2YWJsZS5mcm9tUHJvbWlzZShcbiAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHJlc29sdmUoXCJDeWNsZUpTXCIpO1xuICB9KVxuKTtcblxuLy8gSU5URVJBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGludGVyYWN0aW9ucyQgPSBjcmVhdGVTdHJlYW0odnRyZWUkID0+IHtcbiAgcmV0dXJuIHJlbmRlcih2dHJlZSQsIFwibWFpblwiKS5pbnRlcmFjdGlvbnMkO1xufSk7XG5cbi8vIFtJTlRFUkFDVElPTlNdIDwtIElOVEVOVCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBjaGFuZ2VOYW1lJCA9IGNyZWF0ZVN0cmVhbShpbnRlcmFjdGlvbnMkID0+IHtcbiAgcmV0dXJuIGludGVyYWN0aW9ucyQuY2hvb3NlKFwiW25hbWU9bmFtZV1cIiwgXCJpbnB1dFwiKS5tYXAoZXZlbnQgPT4gZXZlbnQudGFyZ2V0LnZhbHVlKTtcbn0pO1xuXG4vLyBbSU5URU5UXSA8LSBNT0RFTCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgbmFtZSQgPSBjcmVhdGVTdHJlYW0oKGNoYW5nZU5hbWUkLCBpbnB1dCQpID0+IHtcbiAgcmV0dXJuIGlucHV0JC5tZXJnZShjaGFuZ2VOYW1lJCkuc3RhcnRXaXRoKFwiXCIpO1xufSk7XG5cbi8vIFtNT0RFTF0gPC0gVklFVyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCB2dHJlZSQgPSBjcmVhdGVTdHJlYW0obmFtZSQgPT4ge1xuICByZXR1cm4gbmFtZSQubWFwKG5hbWUgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICBoKCdkaXYnLCBudWxsLCBbXG4gICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwiZm9ybS1ncm91cFwifSwgW1xuICAgICAgICAgIGgoJ2xhYmVsJywgbnVsbCwgW1wiTmFtZTpcIl0pLFxuICAgICAgICAgIGgoJ2lucHV0Jywge25hbWU6IFwibmFtZVwiLCBjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCIsIHR5cGU6IFwidGV4dFwifSlcbiAgICAgICAgXSksXG4gICAgICAgIGgoJ2hyJywgbnVsbCksXG4gICAgICAgIGgoJ2gxJywgbnVsbCwgW1wiSGVsbG8gXCIsIG5hbWUsIFwiIVwiXSlcbiAgICAgIF0pXG4gICAgKTtcbiAgfSk7XG59KTtcblxuLy8gREFUQS1TSU5LID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubmFtZSQuc3Vic2NyaWJlKG5hbWUgPT4ge1xuICBjb25zb2xlLmxvZyhuYW1lKTtcbn0pO1xuXG4vLyBDWUNMRSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbnRlcmFjdGlvbnMkLmluamVjdCh2dHJlZSQpO1xudnRyZWUkLmluamVjdChuYW1lJCk7XG5uYW1lJC5pbmplY3QoY2hhbmdlTmFtZSQsIGlucHV0JCk7XG5jaGFuZ2VOYW1lJC5pbmplY3QoaW50ZXJhY3Rpb25zJCk7XG4iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiYmFiZWwvcG9seWZpbGxcIik7XG5cbi8vIFNISU1TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8qKlxuICogRXhhbXBsZTogYCRvYnNlcnZhYmxlLnRhcChjb25zb2xlLnNweShcIkhlcmVcIikpLnRhcChjb25zb2xlLnNweShcIkFuZCBUaGVyZSFcIilgXG4gKiBAcGFyYW0gcGFyYW1zIHRvIGJlIGxvZ2dlZCBpbiBmcm9udCBvZiBhY3R1YWwgZGF0YVxuICogQHJldHVybiB2b2lkXG4gKi9cbmNvbnNvbGUuc3B5ID0gZnVuY3Rpb24gc3B5KC4uLnBhcmFtcykge1xuICByZXR1cm4gY29uc29sZS5sb2cuYmluZChjb25zb2xlLCAuLi5wYXJhbXMpO1xufTtcblxuLy9sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbi8vbGV0IHtSeH0gPSBDeWNsZTtcblxuLy9DeWNsZS5sYXRlc3QgPSBmdW5jdGlvbiAoRGF0YU5vZGUsIGtleXMsIHJlc3VsdFNlbGVjdG9yKSB7XG4vLyAgbGV0IG9ic2VydmFibGVzID0ga2V5cy5tYXAoa2V5ID0+IERhdGFOb2RlLmdldChrZXkpKTtcbi8vICBsZXQgYXJncyA9IG9ic2VydmFibGVzLmNvbmNhdChbXG4vLyAgICBmdW5jdGlvbiBzZWxlY3RvciguLi5saXN0KSB7XG4vLyAgICAgIGxldCBpdGVtID0ga2V5cy5yZWR1Y2UoKGl0ZW0sIGtleSkgPT4ge1xuLy8gICAgICAgIGl0ZW1ba2V5LnNsaWNlKDAsIC0xKV0gPSBsaXN0W2tleXMuaW5kZXhPZihrZXkpXTtcbi8vICAgICAgICByZXR1cm4gaXRlbTtcbi8vICAgICAgfSwge30pO1xuLy8gICAgICByZXR1cm4gcmVzdWx0U2VsZWN0b3IoaXRlbSk7XG4vLyAgICB9XG4vLyAgXSk7XG4vLyAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuY29tYmluZUxhdGVzdC5hcHBseShudWxsLCBhcmdzKTtcbi8vfTtcbiJdfQ==
