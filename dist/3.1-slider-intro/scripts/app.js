(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/3.1-slider-intro/scripts/app.js":[function(require,module,exports){
"use strict";

require("./shims");

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Model = require("./model");
var View = require("./view");
var Intent = require("./intent");

// APP =============================================================================================
var DOM = Cycle.createDOMUser("main");

DOM.inject(View).inject(Model).inject(Intent).inject(DOM);

},{"./intent":"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/3.1-slider-intro/scripts/intent.js","./model":"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/3.1-slider-intro/scripts/model.js","./shims":"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/3.1-slider-intro/scripts/shims.js","./view":"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/3.1-slider-intro/scripts/view.js","cyclejs":"cyclejs"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/3.1-slider-intro/scripts/intent.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// EXPORTS =========================================================================================
var Intent = Cycle.createIntent(function (DOM) {
  return {
    changeValue$: DOM.event$(".item", "changeValue").map(function (event) {
      return event.data;
    }) };
});

module.exports = Intent;

},{"cyclejs":"cyclejs"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/3.1-slider-intro/scripts/model.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// EXPORTS =========================================================================================
var Model = Cycle.createModel(function (Intent) {
  return {
    value$: Intent.get("changeValue$").startWith(Math.floor(Math.random() * 100) + 1) };
});

module.exports = Model;

},{"cyclejs":"cyclejs"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/3.1-slider-intro/scripts/shims.js":[function(require,module,exports){
"use strict";

require("object.assign").shim();

console.error = console.log;

},{"object.assign":"object.assign"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/3.1-slider-intro/scripts/slider.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("Slider", function (DOM, Props) {
  var Model = Cycle.createModel(function (Intent, Props) {
    return {
      value$: Props.get("value$").startWith(0).merge(Intent.get("changeValue$")) };
  });

  var View = Cycle.createView(function (Model) {
    var value$ = Model.get("value$");
    return {
      vtree$: value$.map(function (value) {
        return h("div", { className: "form-group" }, [h("label", null, ["Amount"]), h("div", { className: "input-group" }, [h("input", { type: "range", value: value, placeholder: "Amount" }), h("div", { className: "input-group-addon" }, [h("input", { type: "text", value: value, readonly: "1" })])])]);
      }) };
  });

  var Intent = Cycle.createIntent(function (DOM) {
    return {
      changeValue$: DOM.event$("[type=range]", "input").map(function (event) {
        return parseInt(event.target.value);
      }) };
  });

  DOM.inject(View).inject(Model).inject(Intent, Props)[0].inject(DOM);

  return {
    changeValue$: Intent.get("changeValue$")
  };
});

},{"cyclejs":"cyclejs"}],"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/3.1-slider-intro/scripts/view.js":[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var Slider = require("./slider");

// EXPORTS =========================================================================================
var View = Cycle.createView(function (Model) {
  var value$ = Model.get("value$");
  return {
    vtree$: value$.map(function (value) {
      return h("div", { className: "everything" }, [h("div", null, [h("Slider", { value: value })])]);
    }) };
});

module.exports = View;

},{"./slider":"/Users/ivankleshnin/JavaScript/cyclejs-examples/build/3.1-slider-intro/scripts/slider.js","cyclejs":"cyclejs"}]},{},["/Users/ivankleshnin/JavaScript/cyclejs-examples/build/3.1-slider-intro/scripts/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC8zLjEtc2xpZGVyLWludHJvL3NjcmlwdHMvYXBwLmpzIiwiYnVpbGQvMy4xLXNsaWRlci1pbnRyby9zY3JpcHRzL2ludGVudC5qcyIsImJ1aWxkLzMuMS1zbGlkZXItaW50cm8vc2NyaXB0cy9tb2RlbC5qcyIsImJ1aWxkLzMuMS1zbGlkZXItaW50cm8vc2NyaXB0cy9zaGltcy5qcyIsImJ1aWxkLzMuMS1zbGlkZXItaW50cm8vc2NyaXB0cy9zbGlkZXIuanMiLCJidWlsZC8zLjEtc2xpZGVyLWludHJvL3NjcmlwdHMvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7QUFHbkIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9CLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7QUFHakMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFdEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7Ozs7O0FDVjFELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQixFQUFFLEdBQUksS0FBSyxDQUFYLEVBQUU7OztBQUdQLElB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TUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZShcIi4vc2hpbXNcIik7XG5cbi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IE1vZGVsID0gcmVxdWlyZShcIi4vbW9kZWxcIik7XG5sZXQgVmlldyA9IHJlcXVpcmUoXCIuL3ZpZXdcIik7XG5sZXQgSW50ZW50ID0gcmVxdWlyZShcIi4vaW50ZW50XCIpO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgRE9NID0gQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIik7XG5cbkRPTS5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50KS5pbmplY3QoRE9NKTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7Unh9ID0gQ3ljbGU7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBJbnRlbnQgPSBDeWNsZS5jcmVhdGVJbnRlbnQoRE9NID0+IHtcbiAgcmV0dXJuIHtcbiAgICBjaGFuZ2VWYWx1ZSQ6IERPTS5ldmVudCQoXCIuaXRlbVwiLCBcImNoYW5nZVZhbHVlXCIpLm1hcChldmVudCA9PiBldmVudC5kYXRhKSxcbiAgfTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVudDsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7Unh9ID0gQ3ljbGU7XG5cbi8vIEVYUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKEludGVudCA9PiB7XG4gIHJldHVybiB7XG4gICAgdmFsdWUkOiBJbnRlbnQuZ2V0KFwiY2hhbmdlVmFsdWUkXCIpLnN0YXJ0V2l0aChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDApICsgMSksXG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDsiLCJyZXF1aXJlKFwib2JqZWN0LmFzc2lnblwiKS5zaGltKCk7XG5cbmNvbnNvbGUuZXJyb3IgPSBjb25zb2xlLmxvZzsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5cbi8vIEVMRU1FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbkN5Y2xlLnJlZ2lzdGVyQ3VzdG9tRWxlbWVudChcIlNsaWRlclwiLCAoRE9NLCBQcm9wcykgPT4ge1xuICBsZXQgTW9kZWwgPSBDeWNsZS5jcmVhdGVNb2RlbCgoSW50ZW50LCBQcm9wcykgPT4gKHtcbiAgICB2YWx1ZSQ6IFByb3BzLmdldChcInZhbHVlJFwiKS5zdGFydFdpdGgoMClcbiAgICAgIC5tZXJnZShJbnRlbnQuZ2V0KFwiY2hhbmdlVmFsdWUkXCIpKSxcbiAgfSkpO1xuXG4gIGxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiB7XG4gICAgbGV0IHZhbHVlJCA9IE1vZGVsLmdldChcInZhbHVlJFwiKTtcbiAgICByZXR1cm4ge1xuICAgICAgdnRyZWUkOiB2YWx1ZSQubWFwKHZhbHVlID0+IChcbiAgICAgICAgaCgnZGl2Jywge2NsYXNzTmFtZTogXCJmb3JtLWdyb3VwXCJ9LCBbXG4gICAgICAgICAgaCgnbGFiZWwnLCBudWxsLCBbXCJBbW91bnRcIl0pLFxuICAgICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwiaW5wdXQtZ3JvdXBcIn0sIFtcbiAgICAgICAgICAgIGgoJ2lucHV0Jywge3R5cGU6IFwicmFuZ2VcIiwgdmFsdWU6IHZhbHVlLCBwbGFjZWhvbGRlcjogXCJBbW91bnRcIn0pLFxuICAgICAgICAgICAgaCgnZGl2Jywge2NsYXNzTmFtZTogXCJpbnB1dC1ncm91cC1hZGRvblwifSwgW1xuICAgICAgICAgICAgICBoKCdpbnB1dCcsIHt0eXBlOiBcInRleHRcIiwgdmFsdWU6IHZhbHVlLCByZWFkb25seTogXCIxXCJ9KVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICBdKVxuICAgICAgICBdKVxuICAgICAgKSksXG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IEludGVudCA9IEN5Y2xlLmNyZWF0ZUludGVudChET00gPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBjaGFuZ2VWYWx1ZSQ6IERPTS5ldmVudCQoXCJbdHlwZT1yYW5nZV1cIiwgXCJpbnB1dFwiKVxuICAgICAgICAubWFwKGV2ZW50ID0+IHBhcnNlSW50KGV2ZW50LnRhcmdldC52YWx1ZSkpLFxuICAgIH07XG4gIH0pO1xuXG4gIERPTS5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50LCBQcm9wcylbMF0uaW5qZWN0KERPTSk7XG5cbiAgcmV0dXJuIHtcbiAgICBjaGFuZ2VWYWx1ZSQ6IEludGVudC5nZXQoXCJjaGFuZ2VWYWx1ZSRcIilcbiAgfTtcbn0pO1xuIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IEN5Y2xlID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5sZXQge1J4LCBofSA9IEN5Y2xlO1xubGV0IFNsaWRlciA9IHJlcXVpcmUoXCIuL3NsaWRlclwiKTtcblxuLy8gRVhQT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KE1vZGVsID0+IHtcbiAgbGV0IHZhbHVlJCA9IE1vZGVsLmdldChcInZhbHVlJFwiKTtcbiAgcmV0dXJuIHtcbiAgICB2dHJlZSQ6IHZhbHVlJC5tYXAodmFsdWUgPT4gKFxuICAgICAgaCgnZGl2Jywge2NsYXNzTmFtZTogXCJldmVyeXRoaW5nXCJ9LCBbXG4gICAgICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgICAgICBoKCdTbGlkZXInLCB7dmFsdWU6IHZhbHVlfSlcbiAgICAgICAgXSlcbiAgICAgIF0pXG4gICAgKSksXG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3OyJdfQ==
