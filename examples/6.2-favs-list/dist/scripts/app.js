(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("./shims");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var Pictures = require("./pictures");
var Picture = require("./picture");

// APP =============================================================================================
var Model = Cycle.createModel(function (Intent) {
  var favup$ = Intent.get("favup$").map(function (src) {
    return function transform(pictures) {
      var picture = pictures.filter(function (picture) {
        return picture.src == src;
      })[0];
      console.log("Favup:", src);
      picture.favorite = true;
      return pictures;
    };
  });

  var unfav$ = Intent.get("unfav$").map(function (src) {
    return function transform(pictures) {
      var picture = pictures.filter(function (picture) {
        return picture.src == src;
      })[0];
      console.log("Unfav:", src);
      picture.favorite = false;
      return pictures;
    };
  });

  var transforms = Rx.Observable.merge(favup$, unfav$);

  var pictures = [{
    src: "https://avatars3.githubusercontent.com/u/984368?v=3&s=400",
    title: "RxJS",
    favorite: true
  }, {
    src: "https://pbs.twimg.com/media/B5AJRfWCYAAbLyJ.png",
    title: "CycleJS",
    favorite: true
  }, {
    src: "https://github.com/facebook/react/wiki/react-logo-1000-transparent.png",
    title: "ReactJS",
    favorite: false
  }, {
    src: "https://lh6.googleusercontent.com/-TlY7amsfzPs/T9ZgLXXK1cI/AAAAAAABK-c/Ki-inmeYNKk/w749-h794/AngularJS-Shield-large.png",
    title: "AngularJS",
    favorite: false
  }, {
    src: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQupntxEaHEhSpsINjI3n5TQN-oreFn0dEASi6dtGQUARo3UZg-Xxi_NA",
    title: "jQuery",
    favorite: false
  }];

  return {
    pictures$: transforms.startWith(pictures).scan(function (pictures, transform) {
      var result = transform(pictures);
      return result;
    })
  };
});

var View = Cycle.createView(function (Model) {
  return {
    vtree$: Model.get("pictures$").map(function (pictures) {
      return h("div", null, [h("h2", null, ["Pictures"]), h("Pictures", { data: pictures.filter(function (m) {
          return !m.favorite;
        }) }), h("h2", null, ["Favorites"]), h("Pictures", { data: pictures.filter(function (m) {
          return m.favorite;
        }) })]);
    }) };
});

var Intent = Cycle.createIntent(function (User) {
  return {
    favup$: User.event$(".pictures", "favup").map(function (event) {
      return event.data;
    }),
    unfav$: User.event$(".pictures", "unfav").map(function (event) {
      return event.data;
    }) };
});

var User = Cycle.createDOMUser("main");

User.inject(View).inject(Model).inject(Intent).inject(User);

// Not supported yet!
//User.event$("Picture", "click").subscribe(...);
//User.event$("Picture", "favup").subscribe(...);
//User.event$("Picture", "unfav").subscribe(...);

},{"./picture":2,"./pictures":3,"./shims":4,"cyclejs":"cyclejs"}],2:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var Class = require("classnames");

// COMPONENTS ======================================================================================
var props = {
  src$: null,
  title$: null,
  favorite$: null,
  width$: null };

module.exports = Cycle.registerCustomElement("Picture", function (User, Props) {
  var Model = Cycle.createModel(function (Intent, Props) {
    return {
      src$: Props.get("src$").startWith("#").shareReplay(1), // `src$` is exposed so `shareReplay` is required

      title$: Props.get("title$").startWith(""),

      favorite$: Props.get("favorite$").merge(Intent.get("toggle$")).scan(function (favorite) {
        return !favorite;
      })
      //.distinctUntilChanged()
      .startWith(false).shareReplay(1),

      width$: Props.get("width$").startWith(100) };
  });

  var View = Cycle.createView(function (Model) {
    return {
      vtree$: Cycle.latest(Model, Object.keys(props), function (model) {
        return h("div", { className: Class({ picture: true, favorite: model.favorite }) }, [h("img", { src: model.src, width: model.width, title: model.title })]);
      }) };
  });

  var Intent = Cycle.createIntent(function (User) {
    return {
      toggle$: User.event$(".picture", "click").map(function () {
        return true;
      }) };
  });

  User.inject(View).inject(Model).inject(Intent, Props)[0].inject(User);

  return {
    favup$: Model.get("favorite$").filter(function (v) {
      return v;
    }).sample(Intent.get("toggle$")).tap(function () {
      console.log("Picture says favup$");
    }).withLatestFrom(Model.get("src$"), function (_, src) {
      return src;
    }),

    unfav$: Model.get("favorite$").filter(function (v) {
      return !v;
    }).sample(Intent.get("toggle$")).tap(function () {
      console.log("Picture says unfav$");
    }).withLatestFrom(Model.get("src$"), function (_, src) {
      return src;
    }) };
});

},{"classnames":"classnames","cyclejs":"cyclejs"}],3:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var Class = require("classnames");

// COMPONENTS ======================================================================================
module.exports = Cycle.registerCustomElement("Pictures", function (User, Props) {
  var Model = Cycle.createModel(function (Props) {
    return {
      data$: Props.get("data$").startWith([]) };
  });

  var View = Cycle.createView(function (Model) {
    return {
      vtree$: Model.get("data$").map(function (data) {
        return h("div", { className: "pictures" }, [data.map(function (model) {
          return h("Picture", { src: model.src, title: model.title, favorite: model.favorite, width: "100" });
        })]);
      }) };
  });

  User.inject(View).inject(Model).inject(Props);

  return {
    favup$: User.event$(".picture", "favup").map(function (event) {
      return event.data;
    }),
    unfav$: User.event$(".picture", "unfav").map(function (event) {
      return event.data;
    }) };
});

/*
// IMPORTS =========================================================================================
let Cycle = require("cycle");
let Picture = require("./picture");

// COMPONENTS ======================================================================================
export default Cycle.registerCustomElement("Pictures", (User, Props) => {
  let Model = Cycle.createModel(Intent => ({
    pictures$: Props.get("pictures$").startWith([]),
    favorites$: Props.get("favorites$").startWith([]),
  }));

  let View = Cycle.createView(Model => {
    return {
      vtree$: Rx.Observable.combineLatest(
        Model.get("pictures$"), Model.get("favorites$"),
        (pictures, favorites) => {
          let pictures = pictures.map(p => <Picture src={p.src} title={p.title} favorite={p.favorite}/>);
          pictures = pictures.length ? pictures : <p>Loading images..</p>;

          let favorites = favorites.map(p => <Picture src={p.src} title={p.title} favorite={true}/>);
          favorites = favorites.length ? favorites : <p>Click an image to mark it as a favorite.</p>;

          return (
            <div>
              <h2>Instagram Popular</h2>
              <div class="pictures">
                {pictures}
              </div>

              <h2>Your Favorites</h2>
              <div class="favorites">
                {favorites}
              </div>
            </div>
          );
        }
      ),
    };
  });

  let Intent = Cycle.createIntent(User => {
    return {
      changeValue$: User.event$("[type=range]", "input")
        .map(event => parseInt(event.target.value)),

      changeColor$: User.event$("[type=text]", "input")
        .map(event => event.target.value),

      remove$: User.event$(".btn.remove", "click")
        .map(event => true),
    };


    favupClick(id){
    // id holds the ID of the picture that was clicked.
    // Find it in the pictures array, and add it to the favorites
    let favorites = this.state.favorites,
        pictures = this.state.pictures;

    for (let i = 0; i < pictures.length; i++){
      // Find the id in the pictures array
      if (pictures[i].id == id) {
        if (pictures[i].favorite){
            return this.favoriteClick(id);
        }

        // Add the picture to the favorites array,
        // and mark it as a favorite:
        favorites.push(pictures[i]);
        pictures[i].favorite = true;
        break;
      }
    }
    // Update the state and trigger a render
    this.setState({pictures: pictures, favorites: favorites});
  },

  unfavClick(id){
    // Find the picture in the favorites array and remove it. After this,
    // find the picture in the pictures array and mark it as a non-favorite.
    let favorites = this.state.favorites,
      pictures = this.state.pictures;

    for (let i = 0; i < favorites.length; i++){
      if (favorites[i].id == id) break;
    }

    // Remove the picture from favorites array
    favorites.splice(i, 1);


    for (i = 0; i < pictures.length; i++){
      if (pictures[i].id == id) {
        pictures[i].favorite = false;
        break;
      }
    }

    // Update the state and trigger a render
    this.setState({pictures: pictures, favorites: favorites});
  },
  });

  User.inject(View).inject(Props);
});

  getInitialState() {
    // The pictures array will be populated via AJAX, and
    // the favorites one when the user clicks on an image:
    return {
      pictures: [],
      favorites: []
    };
  },

  componentDidMount() {
    // When the component loads, send a jQuery AJAX request
    let self = this;

    // API endpoint for Instagram"s popular images for the day
    let url = "https://api.instagram.com/v1/media/popular?client_id=" + this.props.apiKey + "&callback=?";

    $.getJSON(url, function(result){
      if (!result || !result.data || !result.data.length){
        return;
      }
      let pictures = result.data.map(function(p){
        return {
          id: p.id,
          url: p.link,
          src: p.images.low_resolution.url,
          title: p.caption ? p.caption.text : "",
          favorite: false
        };
      });

      // Update the component"s state. This will trigger a render.
      // Note that this only updates the pictures property, and does
      // not remove the favorites array.
      self.setState({ pictures: pictures });
    });
  },
});
*/

},{"classnames":"classnames","cyclejs":"cyclejs"}],4:[function(require,module,exports){
"use strict";

require("babel/polyfill");
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

    var model = keys.reduce(function (model, key) {
      model[key.slice(0, -1)] = list[keys.indexOf(key)];
      return model;
    }, {});
    return resultSelector(model);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImJ1aWxkL3NjcmlwdHMvYXBwLmpzIiwiYnVpbGQvc2NyaXB0cy9waWN0dXJlLmpzIiwiYnVpbGQvc2NyaXB0cy9waWN0dXJlcy5qcyIsImJ1aWxkL3NjcmlwdHMvc2hpbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUNDQSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkIsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsR0FBTyxLQUFLLENBQWQsRUFBRTtJQUFFLENBQUMsR0FBSSxLQUFLLENBQVYsQ0FBQzs7QUFDVixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDckMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOzs7QUFHbkMsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUN0QyxNQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUMzQyxXQUFPLFNBQVMsU0FBUyxDQUFDLFFBQVEsRUFBRTtBQUNsQyxVQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUEsT0FBTztlQUFJLE9BQU8sQ0FBQyxHQUFHLElBQUksR0FBRztPQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRSxhQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMzQixhQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUN4QixhQUFPLFFBQVEsQ0FBQztLQUNqQixDQUFDO0dBQ0gsQ0FBQyxD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QUMsQ0FBQztHQUM5QixDQUNGLENBQUMsQ0FBQztBQUNILFNBQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztDQUN0RCxDQUFDOztBQUVGLE9BQU8sQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEdBQVk7OztvQ0FBUixNQUFNO0FBQU4sVUFBTTs7O0FBQ2xDLFNBQU8sZ0JBQUEsT0FBTyxDQUFDLEdBQUcsRUFBQyxJQUFJLE1BQUEsZ0JBQUMsT0FBTyxTQUFLLE1BQU0sRUFBQyxDQUFDO0NBQzdDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxucmVxdWlyZShcIi4vc2hpbXNcIik7XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5sZXQgUGljdHVyZXMgPSByZXF1aXJlKFwiLi9waWN0dXJlc1wiKTtcbmxldCBQaWN0dXJlID0gcmVxdWlyZShcIi4vcGljdHVyZVwiKTtcblxuLy8gQVBQID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IE1vZGVsID0gQ3ljbGUuY3JlYXRlTW9kZWwoSW50ZW50ID0+IHtcbiAgbGV0IGZhdnVwJCA9IEludGVudC5nZXQoXCJmYXZ1cCRcIikubWFwKHNyYyA9PiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHRyYW5zZm9ybShwaWN0dXJlcykge1xuICAgICAgbGV0IHBpY3R1cmUgPSBwaWN0dXJlcy5maWx0ZXIocGljdHVyZSA9PiBwaWN0dXJlLnNyYyA9PSBzcmMpWzBdO1xuICAgICAgY29uc29sZS5sb2coXCJGYXZ1cDpcIiwgc3JjKTtcbiAgICAgIHBpY3R1cmUuZmF2b3JpdGUgPSB0cnVlO1xuICAgICAgcmV0dXJuIHBpY3R1cmVzO1xuICAgIH07XG4gIH0pO1xuXG4gIGxldCB1bmZhdiQgPSBJbnRlbnQuZ2V0KFwidW5mYXYkXCIpLm1hcChzcmMgPT4ge1xuICAgIHJldHVybiBmdW5jdGlvbiB0cmFuc2Zvcm0ocGljdHVyZXMpIHtcbiAgICAgIGxldCBwaWN0dXJlID0gcGljdHVyZXMuZmlsdGVyKHBpY3R1cmUgPT4gcGljdHVyZS5zcmMgPT0gc3JjKVswXTtcbiAgICAgIGNvbnNvbGUubG9nKFwiVW5mYXY6XCIsIHNyYyk7XG4gICAgICBwaWN0dXJlLmZhdm9yaXRlID0gZmFsc2U7XG4gICAgICByZXR1cm4gcGljdHVyZXM7XG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IHRyYW5zZm9ybXMgPSBSeC5PYnNlcnZhYmxlLm1lcmdlKGZhdnVwJCwgdW5mYXYkKTtcblxuICBsZXQgcGljdHVyZXMgPSBbXG4gICAge1xuICAgICAgc3JjOiBcImh0dHBzOi8vYXZhdGFyczMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvOTg0MzY4P3Y9MyZzPTQwMFwiLFxuICAgICAgdGl0bGU6IFwiUnhKU1wiLFxuICAgICAgZmF2b3JpdGU6IHRydWVcbiAgICB9LFxuICAgIHtcbiAgICAgIHNyYzogXCJodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjVBSlJmV0NZQUFiTHlKLnBuZ1wiLFxuICAgICAgdGl0bGU6IFwiQ3ljbGVKU1wiLFxuICAgICAgZmF2b3JpdGU6IHRydWVcbiAgICB9LFxuICAgIHtcbiAgICAgIHNyYzogXCJodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3Qvd2lraS9yZWFjdC1sb2dvLTEwMDAtdHJhbnNwYXJlbnQucG5nXCIsXG4gICAgICB0aXRsZTogXCJSZWFjdEpTXCIsXG4gICAgICBmYXZvcml0ZTogZmFsc2VcbiAgICB9LFxuICAgIHtcbiAgICAgIHNyYzogXCJodHRwczovL2xoNi5nb29nbGV1c2VyY29udGVudC5jb20vLVRsWTdhbXNmelBzL1Q5WmdMWFhLMWNJL0FBQUFBQUFCSy1jL0tpLWlubWVZTktrL3c3NDktaDc5NC9Bbmd1bGFySlMtU2hpZWxkLWxhcmdlLnBuZ1wiLFxuICAgICAgdGl0bGU6IFwiQW5ndWxhckpTXCIsXG4gICAgICBmYXZvcml0ZTogZmFsc2VcbiAgICB9LFxuICAgIHtcbiAgICAgIHNyYzogXCJodHRwczovL2VuY3J5cHRlZC10Ym4xLmdzdGF0aWMuY29tL2ltYWdlcz9xPXRibjpBTmQ5R2NRdXBudHhFYUhFaFNwc0lOakkzbjVUUU4tb3JlRm4wZEVBU2k2ZHRHUVVBUm8zVVpnLVh4aV9OQVwiLFxuICAgICAgdGl0bGU6IFwialF1ZXJ5XCIsXG4gICAgICBmYXZvcml0ZTogZmFsc2VcbiAgICB9LFxuICBdO1xuXG4gIHJldHVybiB7XG4gICAgcGljdHVyZXMkOiB0cmFuc2Zvcm1zXG4gICAgICAuc3RhcnRXaXRoKHBpY3R1cmVzKVxuICAgICAgLnNjYW4oKHBpY3R1cmVzLCB0cmFuc2Zvcm0pID0+IHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRyYW5zZm9ybShwaWN0dXJlcyk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KVxuICB9O1xufSk7XG5cbmxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiAoe1xuICB2dHJlZSQ6IE1vZGVsLmdldChcInBpY3R1cmVzJFwiKS5tYXAocGljdHVyZXMgPT4gKFxuICAgIGgoJ2RpdicsIG51bGwsIFtcbiAgICAgIGgoJ2gyJywgbnVsbCwgW1wiUGljdHVyZXNcIl0pLFxuICAgICAgaCgnUGljdHVyZXMnLCB7ZGF0YTogcGljdHVyZXMuZmlsdGVyKG0gPT4gIW0uZmF2b3JpdGUpfSksXG5cbiAgICAgIGgoJ2gyJywgbnVsbCwgW1wiRmF2b3JpdGVzXCJdKSxcbiAgICAgIGgoJ1BpY3R1cmVzJywge2RhdGE6IHBpY3R1cmVzLmZpbHRlcihtID0+IG0uZmF2b3JpdGUpfSlcbiAgICBdKVxuICApKSxcbn0pKTtcblxubGV0IEludGVudCA9IEN5Y2xlLmNyZWF0ZUludGVudChVc2VyID0+ICh7XG4gIGZhdnVwJDogVXNlci5ldmVudCQoXCIucGljdHVyZXNcIiwgXCJmYXZ1cFwiKS5tYXAoZXZlbnQgPT4gZXZlbnQuZGF0YSksXG4gIHVuZmF2JDogVXNlci5ldmVudCQoXCIucGljdHVyZXNcIiwgXCJ1bmZhdlwiKS5tYXAoZXZlbnQgPT4gZXZlbnQuZGF0YSksXG59KSk7XG5cbmxldCBVc2VyID0gQ3ljbGUuY3JlYXRlRE9NVXNlcihcIm1haW5cIik7XG5cblVzZXIuaW5qZWN0KFZpZXcpLmluamVjdChNb2RlbCkuaW5qZWN0KEludGVudCkuaW5qZWN0KFVzZXIpO1xuXG4vLyBOb3Qgc3VwcG9ydGVkIHlldCFcbi8vVXNlci5ldmVudCQoXCJQaWN0dXJlXCIsIFwiY2xpY2tcIikuc3Vic2NyaWJlKC4uLik7XG4vL1VzZXIuZXZlbnQkKFwiUGljdHVyZVwiLCBcImZhdnVwXCIpLnN1YnNjcmliZSguLi4pO1xuLy9Vc2VyLmV2ZW50JChcIlBpY3R1cmVcIiwgXCJ1bmZhdlwiKS5zdWJzY3JpYmUoLi4uKTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5sZXQgQ2xhc3MgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IHByb3BzID0ge1xuICBzcmMkOiBudWxsLFxuICB0aXRsZSQ6IG51bGwsXG4gIGZhdm9yaXRlJDogbnVsbCxcbiAgd2lkdGgkOiBudWxsLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ3ljbGUucmVnaXN0ZXJDdXN0b21FbGVtZW50KFwiUGljdHVyZVwiLCAoVXNlciwgUHJvcHMpID0+IHtcbiAgbGV0IE1vZGVsID0gQ3ljbGUuY3JlYXRlTW9kZWwoKEludGVudCwgUHJvcHMpID0+ICh7XG4gICAgc3JjJDogUHJvcHMuZ2V0KFwic3JjJFwiKS5zdGFydFdpdGgoXCIjXCIpLnNoYXJlUmVwbGF5KDEpLCAvLyBgc3JjJGAgaXMgZXhwb3NlZCBzbyBgc2hhcmVSZXBsYXlgIGlzIHJlcXVpcmVkXG5cbiAgICB0aXRsZSQ6IFByb3BzLmdldChcInRpdGxlJFwiKS5zdGFydFdpdGgoXCJcIiksXG5cbiAgICBmYXZvcml0ZSQ6IFByb3BzLmdldChcImZhdm9yaXRlJFwiKVxuICAgICAgLm1lcmdlKEludGVudC5nZXQoXCJ0b2dnbGUkXCIpKVxuICAgICAgLnNjYW4oZmF2b3JpdGUgPT4gIWZhdm9yaXRlKVxuICAgICAgLy8uZGlzdGluY3RVbnRpbENoYW5nZWQoKVxuICAgICAgLnN0YXJ0V2l0aChmYWxzZSlcbiAgICAgIC5zaGFyZVJlcGxheSgxKSxcblxuICAgIHdpZHRoJDogUHJvcHMuZ2V0KFwid2lkdGgkXCIpLnN0YXJ0V2l0aCgxMDApLFxuICB9KSk7XG5cbiAgbGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KE1vZGVsID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgdnRyZWUkOiBDeWNsZS5sYXRlc3QoTW9kZWwsIE9iamVjdC5rZXlzKHByb3BzKSwgbW9kZWwgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBoKCdkaXYnLCB7Y2xhc3NOYW1lOiBDbGFzcyh7cGljdHVyZTogdHJ1ZSwgZmF2b3JpdGU6IG1vZGVsLmZhdm9yaXRlfSl9LCBbXG4gICAgICAgICAgICAgIGgoJ2ltZycsIHtzcmM6IG1vZGVsLnNyYywgd2lkdGg6IG1vZGVsLndpZHRoLCB0aXRsZTogbW9kZWwudGl0bGV9KVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICApLFxuICAgIH07XG4gIH0pO1xuXG4gIGxldCBJbnRlbnQgPSBDeWNsZS5jcmVhdGVJbnRlbnQoVXNlciA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvZ2dsZSQ6IFVzZXIuZXZlbnQkKFwiLnBpY3R1cmVcIiwgXCJjbGlja1wiKS5tYXAoKCkgPT4gdHJ1ZSksXG4gICAgfTtcbiAgfSk7XG5cbiAgVXNlci5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50LCBQcm9wcylbMF0uaW5qZWN0KFVzZXIpO1xuXG4gIHJldHVybiB7XG4gICAgZmF2dXAkOiBNb2RlbC5nZXQoXCJmYXZvcml0ZSRcIikuZmlsdGVyKHYgPT4gdilcbiAgICAgIC5zYW1wbGUoSW50ZW50LmdldChcInRvZ2dsZSRcIikpXG4gICAgICAudGFwKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBpY3R1cmUgc2F5cyBmYXZ1cCRcIik7XG4gICAgICB9KVxuICAgICAgLndpdGhMYXRlc3RGcm9tKE1vZGVsLmdldChcInNyYyRcIiksIChfLCBzcmMpID0+IHNyYyksXG5cbiAgICB1bmZhdiQ6IE1vZGVsLmdldChcImZhdm9yaXRlJFwiKS5maWx0ZXIodiA9PiAhdilcbiAgICAgIC5zYW1wbGUoSW50ZW50LmdldChcInRvZ2dsZSRcIikpXG4gICAgICAudGFwKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBpY3R1cmUgc2F5cyB1bmZhdiRcIik7XG4gICAgICB9KVxuICAgICAgLndpdGhMYXRlc3RGcm9tKE1vZGVsLmdldChcInNyYyRcIiksIChfLCBzcmMpID0+IHNyYyksXG4gIH07XG59KTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5sZXQgQ2xhc3MgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgQ3ljbGUucmVnaXN0ZXJDdXN0b21FbGVtZW50KFwiUGljdHVyZXNcIiwgKFVzZXIsIFByb3BzKSA9PiB7XG4gIGxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKFByb3BzID0+ICh7XG4gICAgZGF0YSQ6IFByb3BzLmdldChcImRhdGEkXCIpLnN0YXJ0V2l0aChbXSksXG4gIH0pKTtcblxuICBsZXQgVmlldyA9IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB2dHJlZSQ6IE1vZGVsLmdldChcImRhdGEkXCIpLm1hcChkYXRhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBoKCdkaXYnLCB7Y2xhc3NOYW1lOiBcInBpY3R1cmVzXCJ9LCBbXG4gICAgICAgICAgICBkYXRhLm1hcChtb2RlbCA9PiAoXG4gICAgICAgICAgICAgIGgoJ1BpY3R1cmUnLCB7c3JjOiBtb2RlbC5zcmMsIHRpdGxlOiBtb2RlbC50aXRsZSwgZmF2b3JpdGU6IG1vZGVsLmZhdm9yaXRlLCB3aWR0aDogXCIxMDBcIn0pXG4gICAgICAgICAgICApKVxuICAgICAgICAgIF0pXG4gICAgICAgICk7XG4gICAgICB9KSxcbiAgICB9O1xuICB9KTtcblxuICBVc2VyLmluamVjdChWaWV3KS5pbmplY3QoTW9kZWwpLmluamVjdChQcm9wcyk7XG5cbiAgcmV0dXJuIHtcbiAgICBmYXZ1cCQ6IFVzZXIuZXZlbnQkKFwiLnBpY3R1cmVcIiwgXCJmYXZ1cFwiKS5tYXAoZXZlbnQgPT4gZXZlbnQuZGF0YSksXG4gICAgdW5mYXYkOiBVc2VyLmV2ZW50JChcIi5waWN0dXJlXCIsIFwidW5mYXZcIikubWFwKGV2ZW50ID0+IGV2ZW50LmRhdGEpLFxuICB9O1xufSk7XG5cbi8qXG4vLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVcIik7XG5sZXQgUGljdHVyZSA9IHJlcXVpcmUoXCIuL3BpY3R1cmVcIik7XG5cbi8vIENPTVBPTkVOVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IEN5Y2xlLnJlZ2lzdGVyQ3VzdG9tRWxlbWVudChcIlBpY3R1cmVzXCIsIChVc2VyLCBQcm9wcykgPT4ge1xuICBsZXQgTW9kZWwgPSBDeWNsZS5jcmVhdGVNb2RlbChJbnRlbnQgPT4gKHtcbiAgICBwaWN0dXJlcyQ6IFByb3BzLmdldChcInBpY3R1cmVzJFwiKS5zdGFydFdpdGgoW10pLFxuICAgIGZhdm9yaXRlcyQ6IFByb3BzLmdldChcImZhdm9yaXRlcyRcIikuc3RhcnRXaXRoKFtdKSxcbiAgfSkpO1xuXG4gIGxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZ0cmVlJDogUnguT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0KFxuICAgICAgICBNb2RlbC5nZXQoXCJwaWN0dXJlcyRcIiksIE1vZGVsLmdldChcImZhdm9yaXRlcyRcIiksXG4gICAgICAgIChwaWN0dXJlcywgZmF2b3JpdGVzKSA9PiB7XG4gICAgICAgICAgbGV0IHBpY3R1cmVzID0gcGljdHVyZXMubWFwKHAgPT4gPFBpY3R1cmUgc3JjPXtwLnNyY30gdGl0bGU9e3AudGl0bGV9IGZhdm9yaXRlPXtwLmZhdm9yaXRlfS8+KTtcbiAgICAgICAgICBwaWN0dXJlcyA9IHBpY3R1cmVzLmxlbmd0aCA/IHBpY3R1cmVzIDogPHA+TG9hZGluZyBpbWFnZXMuLjwvcD47XG5cbiAgICAgICAgICBsZXQgZmF2b3JpdGVzID0gZmF2b3JpdGVzLm1hcChwID0+IDxQaWN0dXJlIHNyYz17cC5zcmN9IHRpdGxlPXtwLnRpdGxlfSBmYXZvcml0ZT17dHJ1ZX0vPik7XG4gICAgICAgICAgZmF2b3JpdGVzID0gZmF2b3JpdGVzLmxlbmd0aCA/IGZhdm9yaXRlcyA6IDxwPkNsaWNrIGFuIGltYWdlIHRvIG1hcmsgaXQgYXMgYSBmYXZvcml0ZS48L3A+O1xuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxoMj5JbnN0YWdyYW0gUG9wdWxhcjwvaDI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaWN0dXJlc1wiPlxuICAgICAgICAgICAgICAgIHtwaWN0dXJlc31cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGgyPllvdXIgRmF2b3JpdGVzPC9oMj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZhdm9yaXRlc1wiPlxuICAgICAgICAgICAgICAgIHtmYXZvcml0ZXN9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgKSxcbiAgICB9O1xuICB9KTtcblxuICBsZXQgSW50ZW50ID0gQ3ljbGUuY3JlYXRlSW50ZW50KFVzZXIgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBjaGFuZ2VWYWx1ZSQ6IFVzZXIuZXZlbnQkKFwiW3R5cGU9cmFuZ2VdXCIsIFwiaW5wdXRcIilcbiAgICAgICAgLm1hcChldmVudCA9PiBwYXJzZUludChldmVudC50YXJnZXQudmFsdWUpKSxcblxuICAgICAgY2hhbmdlQ29sb3IkOiBVc2VyLmV2ZW50JChcIlt0eXBlPXRleHRdXCIsIFwiaW5wdXRcIilcbiAgICAgICAgLm1hcChldmVudCA9PiBldmVudC50YXJnZXQudmFsdWUpLFxuXG4gICAgICByZW1vdmUkOiBVc2VyLmV2ZW50JChcIi5idG4ucmVtb3ZlXCIsIFwiY2xpY2tcIilcbiAgICAgICAgLm1hcChldmVudCA9PiB0cnVlKSxcbiAgICB9O1xuXG5cbiAgICBmYXZ1cENsaWNrKGlkKXtcbiAgICAvLyBpZCBob2xkcyB0aGUgSUQgb2YgdGhlIHBpY3R1cmUgdGhhdCB3YXMgY2xpY2tlZC5cbiAgICAvLyBGaW5kIGl0IGluIHRoZSBwaWN0dXJlcyBhcnJheSwgYW5kIGFkZCBpdCB0byB0aGUgZmF2b3JpdGVzXG4gICAgbGV0IGZhdm9yaXRlcyA9IHRoaXMuc3RhdGUuZmF2b3JpdGVzLFxuICAgICAgICBwaWN0dXJlcyA9IHRoaXMuc3RhdGUucGljdHVyZXM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBpY3R1cmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIC8vIEZpbmQgdGhlIGlkIGluIHRoZSBwaWN0dXJlcyBhcnJheVxuICAgICAgaWYgKHBpY3R1cmVzW2ldLmlkID09IGlkKSB7XG4gICAgICAgIGlmIChwaWN0dXJlc1tpXS5mYXZvcml0ZSl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYXZvcml0ZUNsaWNrKGlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB0aGUgcGljdHVyZSB0byB0aGUgZmF2b3JpdGVzIGFycmF5LFxuICAgICAgICAvLyBhbmQgbWFyayBpdCBhcyBhIGZhdm9yaXRlOlxuICAgICAgICBmYXZvcml0ZXMucHVzaChwaWN0dXJlc1tpXSk7XG4gICAgICAgIHBpY3R1cmVzW2ldLmZhdm9yaXRlID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFVwZGF0ZSB0aGUgc3RhdGUgYW5kIHRyaWdnZXIgYSByZW5kZXJcbiAgICB0aGlzLnNldFN0YXRlKHtwaWN0dXJlczogcGljdHVyZXMsIGZhdm9yaXRlczogZmF2b3JpdGVzfSk7XG4gIH0sXG5cbiAgdW5mYXZDbGljayhpZCl7XG4gICAgLy8gRmluZCB0aGUgcGljdHVyZSBpbiB0aGUgZmF2b3JpdGVzIGFycmF5IGFuZCByZW1vdmUgaXQuIEFmdGVyIHRoaXMsXG4gICAgLy8gZmluZCB0aGUgcGljdHVyZSBpbiB0aGUgcGljdHVyZXMgYXJyYXkgYW5kIG1hcmsgaXQgYXMgYSBub24tZmF2b3JpdGUuXG4gICAgbGV0IGZhdm9yaXRlcyA9IHRoaXMuc3RhdGUuZmF2b3JpdGVzLFxuICAgICAgcGljdHVyZXMgPSB0aGlzLnN0YXRlLnBpY3R1cmVzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmYXZvcml0ZXMubGVuZ3RoOyBpKyspe1xuICAgICAgaWYgKGZhdm9yaXRlc1tpXS5pZCA9PSBpZCkgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIHRoZSBwaWN0dXJlIGZyb20gZmF2b3JpdGVzIGFycmF5XG4gICAgZmF2b3JpdGVzLnNwbGljZShpLCAxKTtcblxuXG4gICAgZm9yIChpID0gMDsgaSA8IHBpY3R1cmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGlmIChwaWN0dXJlc1tpXS5pZCA9PSBpZCkge1xuICAgICAgICBwaWN0dXJlc1tpXS5mYXZvcml0ZSA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIHN0YXRlIGFuZCB0cmlnZ2VyIGEgcmVuZGVyXG4gICAgdGhpcy5zZXRTdGF0ZSh7cGljdHVyZXM6IHBpY3R1cmVzLCBmYXZvcml0ZXM6IGZhdm9yaXRlc30pO1xuICB9LFxuICB9KTtcblxuICBVc2VyLmluamVjdChWaWV3KS5pbmplY3QoUHJvcHMpO1xufSk7XG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIC8vIFRoZSBwaWN0dXJlcyBhcnJheSB3aWxsIGJlIHBvcHVsYXRlZCB2aWEgQUpBWCwgYW5kXG4gICAgLy8gdGhlIGZhdm9yaXRlcyBvbmUgd2hlbiB0aGUgdXNlciBjbGlja3Mgb24gYW4gaW1hZ2U6XG4gICAgcmV0dXJuIHtcbiAgICAgIHBpY3R1cmVzOiBbXSxcbiAgICAgIGZhdm9yaXRlczogW11cbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIC8vIFdoZW4gdGhlIGNvbXBvbmVudCBsb2Fkcywgc2VuZCBhIGpRdWVyeSBBSkFYIHJlcXVlc3RcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBBUEkgZW5kcG9pbnQgZm9yIEluc3RhZ3JhbVwicyBwb3B1bGFyIGltYWdlcyBmb3IgdGhlIGRheVxuICAgIGxldCB1cmwgPSBcImh0dHBzOi8vYXBpLmluc3RhZ3JhbS5jb20vdjEvbWVkaWEvcG9wdWxhcj9jbGllbnRfaWQ9XCIgKyB0aGlzLnByb3BzLmFwaUtleSArIFwiJmNhbGxiYWNrPT9cIjtcblxuICAgICQuZ2V0SlNPTih1cmwsIGZ1bmN0aW9uKHJlc3VsdCl7XG4gICAgICBpZiAoIXJlc3VsdCB8fCAhcmVzdWx0LmRhdGEgfHwgIXJlc3VsdC5kYXRhLmxlbmd0aCl7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxldCBwaWN0dXJlcyA9IHJlc3VsdC5kYXRhLm1hcChmdW5jdGlvbihwKXtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogcC5pZCxcbiAgICAgICAgICB1cmw6IHAubGluayxcbiAgICAgICAgICBzcmM6IHAuaW1hZ2VzLmxvd19yZXNvbHV0aW9uLnVybCxcbiAgICAgICAgICB0aXRsZTogcC5jYXB0aW9uID8gcC5jYXB0aW9uLnRleHQgOiBcIlwiLFxuICAgICAgICAgIGZhdm9yaXRlOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFVwZGF0ZSB0aGUgY29tcG9uZW50XCJzIHN0YXRlLiBUaGlzIHdpbGwgdHJpZ2dlciBhIHJlbmRlci5cbiAgICAgIC8vIE5vdGUgdGhhdCB0aGlzIG9ubHkgdXBkYXRlcyB0aGUgcGljdHVyZXMgcHJvcGVydHksIGFuZCBkb2VzXG4gICAgICAvLyBub3QgcmVtb3ZlIHRoZSBmYXZvcml0ZXMgYXJyYXkuXG4gICAgICBzZWxmLnNldFN0YXRlKHsgcGljdHVyZXM6IHBpY3R1cmVzIH0pO1xuICAgIH0pO1xuICB9LFxufSk7XG4qLyIsInJlcXVpcmUoXCJiYWJlbC9wb2x5ZmlsbFwiKTtcbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeH0gPSBDeWNsZTtcblxuQ3ljbGUubGF0ZXN0ID0gZnVuY3Rpb24oRGF0YU5vZGUsIGtleXMsIHJlc3VsdFNlbGVjdG9yKSB7XG4gIGxldCBvYnNlcnZhYmxlcyA9IGtleXMubWFwKGtleSA9PiBEYXRhTm9kZS5nZXQoa2V5KSk7XG4gIGxldCBhcmdzID0gb2JzZXJ2YWJsZXMuY29uY2F0KFtcbiAgICBmdW5jdGlvbiBzZWxlY3RvciguLi5saXN0KSB7XG4gICAgICBsZXQgbW9kZWwgPSBrZXlzLnJlZHVjZSgobW9kZWwsIGtleSkgPT4ge1xuICAgICAgICBtb2RlbFtrZXkuc2xpY2UoMCwgLTEpXSA9IGxpc3Rba2V5cy5pbmRleE9mKGtleSldO1xuICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICB9LCB7fSk7XG4gICAgICByZXR1cm4gcmVzdWx0U2VsZWN0b3IobW9kZWwpO1xuICAgIH1cbiAgXSk7XG4gIHJldHVybiBSeC5PYnNlcnZhYmxlLmNvbWJpbmVMYXRlc3QuYXBwbHkobnVsbCwgYXJncyk7XG59O1xuXG5jb25zb2xlLnNweSA9IGZ1bmN0aW9uIHNweSguLi5wYXJhbXMpIHtcbiAgcmV0dXJuIGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSwgLi4ucGFyYW1zKTtcbn07XG4iXX0=
