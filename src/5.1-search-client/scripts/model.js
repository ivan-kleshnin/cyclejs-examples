// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// EXPORTS =========================================================================================
let Model = Cycle.createModel((Intent) => {
  return {
    query$: Intent.get("changeQuery$").startWith(""),

    data$: Rx.Observable.return([
      {name: "Angular", url: "https://angularjs.org/"},
      {name: "Backbone", url: "http://documentcloud.github.io/backbone/"},
      {name: "Cycle", url: "https://github.com/staltz/cycle"},
      {name: "Dojo", url: "http://dojotoolkit.org/"},
      {name: "Ember", url: "http://emberjs.com/"},
      {name: "Express", url: "http://expressjs.com/"},
      {name: "jQuery", url: "http://jquery.com/"},
      {name: "Knockout.js", url: "http://knockoutjs.com/"},
      {name: "Koa", url: "http://koajs.com/"},
      {name: "Lodash", url: "http://lodash.com/"},
      {name: "Moment", url: "http://momentjs.com/"},
      {name: "Mootools", url: "http://mootools.net/"},
      {name: "Prototype", url: "http://www.prototypejs.org/"},
      {name: "React", url: "http://facebook.github.io/react/"},
      {name: "Underscore", url: "http://documentcloud.github.io/underscore/"},
    ]),
  };
});

module.exports = Model;