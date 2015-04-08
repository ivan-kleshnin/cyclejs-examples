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
interactions$.inject(vtree$);
vtree$.inject(name$);
name$.inject(changeName$);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC8xLjItaGVsbG8tc3RyZWFtcy9zY3JpcHRzL2FwcC5qcyIsImJ1aWxkL2NvbW1vbi9zY3JpcHRzL3BvbHlmaWxscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0NBLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDOztlQUNOLE9BQU8sQ0FBQyxTQUFTLENBQUM7O0lBQWpELEVBQUUsWUFBRixFQUFFO0lBQUUsQ0FBQyxZQUFELENBQUM7SUFBRSxZQUFZLFlBQVosWUFBWTtJQUFFLE1BQU0sWUFBTixNQUFNOzs7QUFHaEMsSUFBSSxhQUFhLEdBQUcsWUFBWSxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ3pDLFNBQU8sTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUM7Q0FDN0MsQ0FBQyxDQUFDOzs7QUFHSCxJQUFJLFdBQVcsR0FBRyxZQUFZLENBQUMsVUFBQSxhQUFhLEVBQUk7QUFDOUMsU0FBTyxhQUFhLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLO1dBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLO0dBQUEsQ0FBQyxDQUFDO0NBQ3RGLENBQUMsQ0FBQzs7O0FBR0gsSUFBSSxLQUFLLEdBQUcsWUFBWSxDQUFDLFVBQUEsV0FBVyxFQUFJO0FBQ3RDLFNBQU8sV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUNsQyxDQUFDLENBQUM7OztBQUdILElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUNqQyxTQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDdkIsV0FDRSxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUNiLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFDLEVBQUUsQ0FDbEMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUMzQixDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUNwRSxDQUFDLEVBQ0YsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFDYixDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FDckMsQ0FBQyxDQUNGO0dBQ0gsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDOzs7QUFHSCxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUMxQixXQUFXLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDOzs7Ozs7QUN0Q2xDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7Ozs7OztBQVExQixPQUFPLENBQUMsR0FBRyxHQUFHLFNBQVMsR0FBRyxHQUFZOzs7b0NBQVIsTUFBTTtBQUFOLFVBQU07OztBQUNsQyxTQUFPLGdCQUFBLE9BQU8sQ0FBQyxHQUFHLEVBQUMsSUFBSSxNQUFBLGdCQUFDLE9BQU8sU0FBSyxNQUFNLEVBQUMsQ0FBQztDQUM3QyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnJlcXVpcmUoXCIuLi8uLi9jb21tb24vc2NyaXB0cy9wb2x5ZmlsbHNcIik7XG5sZXQge1J4LCBoLCBjcmVhdGVTdHJlYW0sIHJlbmRlcn0gPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcblxuLy8gSU5URVJBQ1RJT05TID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IGludGVyYWN0aW9ucyQgPSBjcmVhdGVTdHJlYW0odnRyZWUkID0+IHtcbiAgcmV0dXJuIHJlbmRlcih2dHJlZSQsIFwibWFpblwiKS5pbnRlcmFjdGlvbnMkO1xufSk7XG5cbi8vIFtJTlRFUkFDVElPTlNdIDwtIElOVEVOVCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBjaGFuZ2VOYW1lJCA9IGNyZWF0ZVN0cmVhbShpbnRlcmFjdGlvbnMkID0+IHtcbiAgcmV0dXJuIGludGVyYWN0aW9ucyQuY2hvb3NlKFwiW25hbWU9bmFtZV1cIiwgXCJpbnB1dFwiKS5tYXAoZXZlbnQgPT4gZXZlbnQudGFyZ2V0LnZhbHVlKTtcbn0pO1xuXG4vLyBbSU5URU5UXSA8LSBNT0RFTCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgbmFtZSQgPSBjcmVhdGVTdHJlYW0oY2hhbmdlTmFtZSQgPT4ge1xuICByZXR1cm4gY2hhbmdlTmFtZSQuc3RhcnRXaXRoKFwiXCIpO1xufSk7XG5cbi8vIFtNT0RFTF0gPC0gVklFVyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCB2dHJlZSQgPSBjcmVhdGVTdHJlYW0obmFtZSQgPT4ge1xuICByZXR1cm4gbmFtZSQubWFwKG5hbWUgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICBoKCdkaXYnLCBudWxsLCBbXG4gICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwiZm9ybS1ncm91cFwifSwgW1xuICAgICAgICAgIGgoJ2xhYmVsJywgbnVsbCwgW1wiTmFtZTpcIl0pLFxuICAgICAgICAgIGgoJ2lucHV0Jywge25hbWU6IFwibmFtZVwiLCBjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCIsIHR5cGU6IFwidGV4dFwifSlcbiAgICAgICAgXSksXG4gICAgICAgIGgoJ2hyJywgbnVsbCksXG4gICAgICAgIGgoJ2gxJywgbnVsbCwgW1wiSGVsbG8gXCIsIG5hbWUsIFwiIVwiXSlcbiAgICAgIF0pXG4gICAgKTtcbiAgfSk7XG59KTtcblxuLy8gQ1lDTEUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW50ZXJhY3Rpb25zJC5pbmplY3QodnRyZWUkKTtcbnZ0cmVlJC5pbmplY3QobmFtZSQpO1xubmFtZSQuaW5qZWN0KGNoYW5nZU5hbWUkKTtcbmNoYW5nZU5hbWUkLmluamVjdChpbnRlcmFjdGlvbnMkKTtcbiIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbnJlcXVpcmUoXCJiYWJlbC9wb2x5ZmlsbFwiKTtcblxuLy8gU0hJTVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLyoqXG4gKiBFeGFtcGxlOiBgJG9ic2VydmFibGUudGFwKGNvbnNvbGUuc3B5KFwiSGVyZVwiKSkudGFwKGNvbnNvbGUuc3B5KFwiQW5kIFRoZXJlIVwiKWBcbiAqIEBwYXJhbSBwYXJhbXMgdG8gYmUgbG9nZ2VkIGluIGZyb250IG9mIGFjdHVhbCBkYXRhXG4gKiBAcmV0dXJuIHZvaWRcbiAqL1xuY29uc29sZS5zcHkgPSBmdW5jdGlvbiBzcHkoLi4ucGFyYW1zKSB7XG4gIHJldHVybiBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUsIC4uLnBhcmFtcyk7XG59O1xuXG4vL2xldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xuLy9sZXQge1J4fSA9IEN5Y2xlO1xuXG4vL0N5Y2xlLmxhdGVzdCA9IGZ1bmN0aW9uIChEYXRhTm9kZSwga2V5cywgcmVzdWx0U2VsZWN0b3IpIHtcbi8vICBsZXQgb2JzZXJ2YWJsZXMgPSBrZXlzLm1hcChrZXkgPT4gRGF0YU5vZGUuZ2V0KGtleSkpO1xuLy8gIGxldCBhcmdzID0gb2JzZXJ2YWJsZXMuY29uY2F0KFtcbi8vICAgIGZ1bmN0aW9uIHNlbGVjdG9yKC4uLmxpc3QpIHtcbi8vICAgICAgbGV0IGl0ZW0gPSBrZXlzLnJlZHVjZSgoaXRlbSwga2V5KSA9PiB7XG4vLyAgICAgICAgaXRlbVtrZXkuc2xpY2UoMCwgLTEpXSA9IGxpc3Rba2V5cy5pbmRleE9mKGtleSldO1xuLy8gICAgICAgIHJldHVybiBpdGVtO1xuLy8gICAgICB9LCB7fSk7XG4vLyAgICAgIHJldHVybiByZXN1bHRTZWxlY3RvcihpdGVtKTtcbi8vICAgIH1cbi8vICBdKTtcbi8vICByZXR1cm4gUnguT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0LmFwcGx5KG51bGwsIGFyZ3MpO1xuLy99O1xuIl19
