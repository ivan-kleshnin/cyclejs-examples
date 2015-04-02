(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
require("../../common/scripts/shims");
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

var Pictures = require("./pictures");
var Picture = require("./picture");
var Model = require("./model");
var View = require("./view");
var Intent = require("./intent");

// APP =============================================================================================
var User = Cycle.createDOMUser("main");

User.inject(View).inject(Model).inject(Intent).inject(User);

// Not supported yet!
//User.event$("Picture", "click").subscribe(...);
//User.event$("Picture", "favup").subscribe(...);
//User.event$("Picture", "unfav").subscribe(...);

},{"../../common/scripts/shims":7,"./intent":2,"./model":3,"./picture":4,"./pictures":5,"./view":6,"cyclejs":"cyclejs"}],2:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// INTENTS =========================================================================================
module.exports = Cycle.createIntent(function (User) {
  return {
    favup$: User.event$(".pictures", "favup").map(function (event) {
      return event.data;
    }),
    unfav$: User.event$(".pictures", "unfav").map(function (event) {
      return event.data;
    }) };
});

},{"cyclejs":"cyclejs"}],3:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;

// MODELS ==========================================================================================
module.exports = Cycle.createModel(function (Intent) {
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

},{"cyclejs":"cyclejs"}],4:[function(require,module,exports){
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
      vtree$: Cycle.latest(Model, Object.keys(props), function (item) {
        return h("div", { className: Class({ picture: true, favorite: item.favorite }) }, [h("img", { src: item.src, width: item.width, title: item.title })]);
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

},{"classnames":"classnames","cyclejs":"cyclejs"}],5:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// COMPONENTS ======================================================================================
module.exports = Cycle.registerCustomElement("Pictures", function (User, Props) {
  var Model = Cycle.createModel(function (Props) {
    return {
      data$: Props.get("data$").startWith([]) };
  });

  var View = Cycle.createView(function (Model) {
    return {
      vtree$: Model.get("data$").map(function (data) {
        return h("div", { className: "pictures" }, [data.map(function (item) {
          return h("Picture", { key: item.src, src: item.src, title: item.title, favorite: item.favorite, width: "100" });
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

    $.getJSON(url, function (result){
      if (!result || !result.data || !result.data.length){
        return;
      }
      let pictures = result.data.map(function (p){
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

},{"cyclejs":"cyclejs"}],6:[function(require,module,exports){
"use strict";

// IMPORTS =========================================================================================
var Cycle = require("cyclejs");
var Rx = Cycle.Rx;
var h = Cycle.h;

// VIEWS ===========================================================================================
module.exports = Cycle.createView(function (Model) {
  return {
    vtree$: Model.get("pictures$").map(function (pictures) {
      return h("div", null, [h("h2", null, ["Pictures"]), h("Pictures", { data: pictures.filter(function (m) {
          return !m.favorite;
        }) }), h("h2", null, ["Favorites"]), h("Pictures", { data: pictures.filter(function (m) {
          return m.favorite;
        }) })]);
    }) };
});

},{"cyclejs":"cyclejs"}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC82LjItZmF2cy1saXN0L3NjcmlwdHMvYXBwLmpzIiwiYnVpbGQvNi4yLWZhdnMtbGlzdC9zY3JpcHRzL2ludGVudC5qcyIsImJ1aWxkLzYuMi1mYXZzLWxpc3Qvc2NyaXB0cy9tb2RlbC5qcyIsImJ1aWxkLzYuMi1mYXZzLWxpc3Qvc2NyaXB0cy9waWN0dXJlLmpzIiwiYnVpbGQvNi4yLWZhdnMtbGlzdC9zY3JpcHRzL3BpY3R1cmVzLmpzIiwiYnVpbGQvNi4yLWZhdnMtbGlzdC9zY3JpcHRzL3ZpZXcuanMiLCJidWlsZC9jb21tb24vc2NyaXB0cy9zaGltcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztBQ0NBLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3RDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQixFQUFFLEdBQU8sS0FBSyxDQUFkLEVBQUU7SUFBRSxDQUFDLEdBQUksS0FBSyxDQUFWLENBQUM7O0FBQ1YsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3JDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDL0IsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzdCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7O0FBR2pDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXZDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENB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QVUsUUFBUSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUU7QUFDdkQsTUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUc7V0FBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztHQUFBLENBQUMsQ0FBQztBQUNyRCxNQUFJLElBQUksR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQzVCLFNBQVMsUUFBUSxHQUFVO3NDQUFOLElBQUk7QUFBSixVQUFJOzs7QUFDdkIsUUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBRSxHQUFHLEVBQUs7QUFDcEMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2pELGFBQU8sSUFBSSxDQUFDO0tBQ2IsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNQLFdBQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzdCLENBQ0YsQ0FBQyxDQUFDO0FBQ0gsU0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ3RELENBQUM7O0FBRUYsT0FBTyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsR0FBWTs7O29DQUFSLE1BQU07QUFBTixVQUFNOzs7QUFDbEMsU0FBTyxnQkFBQSxPQUFPLENBQUMsR0FBRyxFQUFDLElBQUksTUFBQSxnQkFBQyxPQUFPLFNBQUssTUFBTSxFQUFDLENBQUM7Q0FDN0MsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiLi4vLi4vY29tbW9uL3NjcmlwdHMvc2hpbXNcIik7XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5sZXQgUGljdHVyZXMgPSByZXF1aXJlKFwiLi9waWN0dXJlc1wiKTtcbmxldCBQaWN0dXJlID0gcmVxdWlyZShcIi4vcGljdHVyZVwiKTtcbmxldCBNb2RlbCA9IHJlcXVpcmUoXCIuL21vZGVsXCIpO1xubGV0IFZpZXcgPSByZXF1aXJlKFwiLi92aWV3XCIpO1xubGV0IEludGVudCA9IHJlcXVpcmUoXCIuL2ludGVudFwiKTtcblxuLy8gQVBQID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxubGV0IFVzZXIgPSBDeWNsZS5jcmVhdGVET01Vc2VyKFwibWFpblwiKTtcblxuVXNlci5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50KS5pbmplY3QoVXNlcik7XG5cbi8vIE5vdCBzdXBwb3J0ZWQgeWV0IVxuLy9Vc2VyLmV2ZW50JChcIlBpY3R1cmVcIiwgXCJjbGlja1wiKS5zdWJzY3JpYmUoLi4uKTtcbi8vVXNlci5ldmVudCQoXCJQaWN0dXJlXCIsIFwiZmF2dXBcIikuc3Vic2NyaWJlKC4uLik7XG4vL1VzZXIuZXZlbnQkKFwiUGljdHVyZVwiLCBcInVuZmF2XCIpLnN1YnNjcmliZSguLi4pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeH0gPSBDeWNsZTtcblxuLy8gSU5URU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgQ3ljbGUuY3JlYXRlSW50ZW50KFVzZXIgPT4gKHtcbiAgZmF2dXAkOiBVc2VyLmV2ZW50JChcIi5waWN0dXJlc1wiLCBcImZhdnVwXCIpLm1hcChldmVudCA9PiBldmVudC5kYXRhKSxcbiAgdW5mYXYkOiBVc2VyLmV2ZW50JChcIi5waWN0dXJlc1wiLCBcInVuZmF2XCIpLm1hcChldmVudCA9PiBldmVudC5kYXRhKSxcbn0pKTsiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7Unh9ID0gQ3ljbGU7XG5cbi8vIE1PREVMUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IEN5Y2xlLmNyZWF0ZU1vZGVsKEludGVudCA9PiB7XG4gIGxldCBmYXZ1cCQgPSBJbnRlbnQuZ2V0KFwiZmF2dXAkXCIpLm1hcChzcmMgPT4ge1xuICAgIHJldHVybiBmdW5jdGlvbiB0cmFuc2Zvcm0ocGljdHVyZXMpIHtcbiAgICAgIGxldCBwaWN0dXJlID0gcGljdHVyZXMuZmlsdGVyKHBpY3R1cmUgPT4gcGljdHVyZS5zcmMgPT0gc3JjKVswXTtcbiAgICAgIGNvbnNvbGUubG9nKFwiRmF2dXA6XCIsIHNyYyk7XG4gICAgICBwaWN0dXJlLmZhdm9yaXRlID0gdHJ1ZTtcbiAgICAgIHJldHVybiBwaWN0dXJlcztcbiAgICB9O1xuICB9KTtcblxuICBsZXQgdW5mYXYkID0gSW50ZW50LmdldChcInVuZmF2JFwiKS5tYXAoc3JjID0+IHtcbiAgICByZXR1cm4gZnVuY3Rpb24gdHJhbnNmb3JtKHBpY3R1cmVzKSB7XG4gICAgICBsZXQgcGljdHVyZSA9IHBpY3R1cmVzLmZpbHRlcihwaWN0dXJlID0+IHBpY3R1cmUuc3JjID09IHNyYylbMF07XG4gICAgICBjb25zb2xlLmxvZyhcIlVuZmF2OlwiLCBzcmMpO1xuICAgICAgcGljdHVyZS5mYXZvcml0ZSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHBpY3R1cmVzO1xuICAgIH07XG4gIH0pO1xuXG4gIGxldCB0cmFuc2Zvcm1zID0gUnguT2JzZXJ2YWJsZS5tZXJnZShmYXZ1cCQsIHVuZmF2JCk7XG5cbiAgbGV0IHBpY3R1cmVzID0gW1xuICAgIHtcbiAgICAgIHNyYzogXCJodHRwczovL2F2YXRhcnMzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91Lzk4NDM2OD92PTMmcz00MDBcIixcbiAgICAgIHRpdGxlOiBcIlJ4SlNcIixcbiAgICAgIGZhdm9yaXRlOiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICBzcmM6IFwiaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I1QUpSZldDWUFBYkx5Si5wbmdcIixcbiAgICAgIHRpdGxlOiBcIkN5Y2xlSlNcIixcbiAgICAgIGZhdm9yaXRlOiB0cnVlXG4gICAgfSxcbiAgICB7XG4gICAgICBzcmM6IFwiaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L3dpa2kvcmVhY3QtbG9nby0xMDAwLXRyYW5zcGFyZW50LnBuZ1wiLFxuICAgICAgdGl0bGU6IFwiUmVhY3RKU1wiLFxuICAgICAgZmF2b3JpdGU6IGZhbHNlXG4gICAgfSxcbiAgICB7XG4gICAgICBzcmM6IFwiaHR0cHM6Ly9saDYuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1UbFk3YW1zZnpQcy9UOVpnTFhYSzFjSS9BQUFBQUFBQkstYy9LaS1pbm1lWU5Lay93NzQ5LWg3OTQvQW5ndWxhckpTLVNoaWVsZC1sYXJnZS5wbmdcIixcbiAgICAgIHRpdGxlOiBcIkFuZ3VsYXJKU1wiLFxuICAgICAgZmF2b3JpdGU6IGZhbHNlXG4gICAgfSxcbiAgICB7XG4gICAgICBzcmM6IFwiaHR0cHM6Ly9lbmNyeXB0ZWQtdGJuMS5nc3RhdGljLmNvbS9pbWFnZXM/cT10Ym46QU5kOUdjUXVwbnR4RWFIRWhTcHNJTmpJM241VFFOLW9yZUZuMGRFQVNpNmR0R1FVQVJvM1VaZy1YeGlfTkFcIixcbiAgICAgIHRpdGxlOiBcImpRdWVyeVwiLFxuICAgICAgZmF2b3JpdGU6IGZhbHNlXG4gICAgfSxcbiAgXTtcblxuICByZXR1cm4ge1xuICAgIHBpY3R1cmVzJDogdHJhbnNmb3Jtc1xuICAgICAgLnN0YXJ0V2l0aChwaWN0dXJlcylcbiAgICAgIC5zY2FuKChwaWN0dXJlcywgdHJhbnNmb3JtKSA9PiB7XG4gICAgICAgIGxldCByZXN1bHQgPSB0cmFuc2Zvcm0ocGljdHVyZXMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfSlcbiAgfTtcbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcbmxldCBDbGFzcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgcHJvcHMgPSB7XG4gIHNyYyQ6IG51bGwsXG4gIHRpdGxlJDogbnVsbCxcbiAgZmF2b3JpdGUkOiBudWxsLFxuICB3aWR0aCQ6IG51bGwsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDeWNsZS5yZWdpc3RlckN1c3RvbUVsZW1lbnQoXCJQaWN0dXJlXCIsIChVc2VyLCBQcm9wcykgPT4ge1xuICBsZXQgTW9kZWwgPSBDeWNsZS5jcmVhdGVNb2RlbCgoSW50ZW50LCBQcm9wcykgPT4gKHtcbiAgICBzcmMkOiBQcm9wcy5nZXQoXCJzcmMkXCIpLnN0YXJ0V2l0aChcIiNcIikuc2hhcmVSZXBsYXkoMSksIC8vIGBzcmMkYCBpcyBleHBvc2VkIHNvIGBzaGFyZVJlcGxheWAgaXMgcmVxdWlyZWRcblxuICAgIHRpdGxlJDogUHJvcHMuZ2V0KFwidGl0bGUkXCIpLnN0YXJ0V2l0aChcIlwiKSxcblxuICAgIGZhdm9yaXRlJDogUHJvcHMuZ2V0KFwiZmF2b3JpdGUkXCIpXG4gICAgICAubWVyZ2UoSW50ZW50LmdldChcInRvZ2dsZSRcIikpXG4gICAgICAuc2NhbihmYXZvcml0ZSA9PiAhZmF2b3JpdGUpXG4gICAgICAvLy5kaXN0aW5jdFVudGlsQ2hhbmdlZCgpXG4gICAgICAuc3RhcnRXaXRoKGZhbHNlKVxuICAgICAgLnNoYXJlUmVwbGF5KDEpLFxuXG4gICAgd2lkdGgkOiBQcm9wcy5nZXQoXCJ3aWR0aCRcIikuc3RhcnRXaXRoKDEwMCksXG4gIH0pKTtcblxuICBsZXQgVmlldyA9IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB2dHJlZSQ6IEN5Y2xlLmxhdGVzdChNb2RlbCwgT2JqZWN0LmtleXMocHJvcHMpLCBpdGVtID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgaCgnZGl2Jywge2NsYXNzTmFtZTogQ2xhc3Moe3BpY3R1cmU6IHRydWUsIGZhdm9yaXRlOiBpdGVtLmZhdm9yaXRlfSl9LCBbXG4gICAgICAgICAgICAgIGgoJ2ltZycsIHtzcmM6IGl0ZW0uc3JjLCB3aWR0aDogaXRlbS53aWR0aCwgdGl0bGU6IGl0ZW0udGl0bGV9KVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICApLFxuICAgIH07XG4gIH0pO1xuXG4gIGxldCBJbnRlbnQgPSBDeWNsZS5jcmVhdGVJbnRlbnQoVXNlciA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvZ2dsZSQ6IFVzZXIuZXZlbnQkKFwiLnBpY3R1cmVcIiwgXCJjbGlja1wiKS5tYXAoKCkgPT4gdHJ1ZSksXG4gICAgfTtcbiAgfSk7XG5cbiAgVXNlci5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50LCBQcm9wcylbMF0uaW5qZWN0KFVzZXIpO1xuXG4gIHJldHVybiB7XG4gICAgZmF2dXAkOiBNb2RlbC5nZXQoXCJmYXZvcml0ZSRcIikuZmlsdGVyKHYgPT4gdilcbiAgICAgIC5zYW1wbGUoSW50ZW50LmdldChcInRvZ2dsZSRcIikpXG4gICAgICAudGFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJQaWN0dXJlIHNheXMgZmF2dXAkXCIpO1xuICAgICAgfSlcbiAgICAgIC53aXRoTGF0ZXN0RnJvbShNb2RlbC5nZXQoXCJzcmMkXCIpLCAoXywgc3JjKSA9PiBzcmMpLFxuXG4gICAgdW5mYXYkOiBNb2RlbC5nZXQoXCJmYXZvcml0ZSRcIikuZmlsdGVyKHYgPT4gIXYpXG4gICAgICAuc2FtcGxlKEludGVudC5nZXQoXCJ0b2dnbGUkXCIpKVxuICAgICAgLnRhcChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGljdHVyZSBzYXlzIHVuZmF2JFwiKTtcbiAgICAgIH0pXG4gICAgICAud2l0aExhdGVzdEZyb20oTW9kZWwuZ2V0KFwic3JjJFwiKSwgKF8sIHNyYykgPT4gc3JjKSxcbiAgfTtcbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgQ3ljbGUucmVnaXN0ZXJDdXN0b21FbGVtZW50KFwiUGljdHVyZXNcIiwgKFVzZXIsIFByb3BzKSA9PiB7XG4gIGxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKFByb3BzID0+ICh7XG4gICAgZGF0YSQ6IFByb3BzLmdldChcImRhdGEkXCIpLnN0YXJ0V2l0aChbXSksXG4gIH0pKTtcblxuICBsZXQgVmlldyA9IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB2dHJlZSQ6IE1vZGVsLmdldChcImRhdGEkXCIpLm1hcChkYXRhID0+IHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBoKCdkaXYnLCB7Y2xhc3NOYW1lOiBcInBpY3R1cmVzXCJ9LCBbXG4gICAgICAgICAgICBkYXRhLm1hcChpdGVtID0+IChcbiAgICAgICAgICAgICAgaCgnUGljdHVyZScsIHtrZXk6IGl0ZW0uc3JjLCBzcmM6IGl0ZW0uc3JjLCB0aXRsZTogaXRlbS50aXRsZSwgZmF2b3JpdGU6IGl0ZW0uZmF2b3JpdGUsIHdpZHRoOiBcIjEwMFwifSlcbiAgICAgICAgICAgICkpXG4gICAgICAgICAgXSlcbiAgICAgICAgKTtcbiAgICAgIH0pLFxuICAgIH07XG4gIH0pO1xuXG4gIFVzZXIuaW5qZWN0KFZpZXcpLmluamVjdChNb2RlbCkuaW5qZWN0KFByb3BzKTtcblxuICByZXR1cm4ge1xuICAgIGZhdnVwJDogVXNlci5ldmVudCQoXCIucGljdHVyZVwiLCBcImZhdnVwXCIpLm1hcChldmVudCA9PiBldmVudC5kYXRhKSxcbiAgICB1bmZhdiQ6IFVzZXIuZXZlbnQkKFwiLnBpY3R1cmVcIiwgXCJ1bmZhdlwiKS5tYXAoZXZlbnQgPT4gZXZlbnQuZGF0YSksXG4gIH07XG59KTtcblxuLypcbi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZVwiKTtcbmxldCBQaWN0dXJlID0gcmVxdWlyZShcIi4vcGljdHVyZVwiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgQ3ljbGUucmVnaXN0ZXJDdXN0b21FbGVtZW50KFwiUGljdHVyZXNcIiwgKFVzZXIsIFByb3BzKSA9PiB7XG4gIGxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKEludGVudCA9PiAoe1xuICAgIHBpY3R1cmVzJDogUHJvcHMuZ2V0KFwicGljdHVyZXMkXCIpLnN0YXJ0V2l0aChbXSksXG4gICAgZmF2b3JpdGVzJDogUHJvcHMuZ2V0KFwiZmF2b3JpdGVzJFwiKS5zdGFydFdpdGgoW10pLFxuICB9KSk7XG5cbiAgbGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KE1vZGVsID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgdnRyZWUkOiBSeC5PYnNlcnZhYmxlLmNvbWJpbmVMYXRlc3QoXG4gICAgICAgIE1vZGVsLmdldChcInBpY3R1cmVzJFwiKSwgTW9kZWwuZ2V0KFwiZmF2b3JpdGVzJFwiKSxcbiAgICAgICAgKHBpY3R1cmVzLCBmYXZvcml0ZXMpID0+IHtcbiAgICAgICAgICBsZXQgcGljdHVyZXMgPSBwaWN0dXJlcy5tYXAocCA9PiA8UGljdHVyZSBzcmM9e3Auc3JjfSB0aXRsZT17cC50aXRsZX0gZmF2b3JpdGU9e3AuZmF2b3JpdGV9Lz4pO1xuICAgICAgICAgIHBpY3R1cmVzID0gcGljdHVyZXMubGVuZ3RoID8gcGljdHVyZXMgOiA8cD5Mb2FkaW5nIGltYWdlcy4uPC9wPjtcblxuICAgICAgICAgIGxldCBmYXZvcml0ZXMgPSBmYXZvcml0ZXMubWFwKHAgPT4gPFBpY3R1cmUgc3JjPXtwLnNyY30gdGl0bGU9e3AudGl0bGV9IGZhdm9yaXRlPXt0cnVlfS8+KTtcbiAgICAgICAgICBmYXZvcml0ZXMgPSBmYXZvcml0ZXMubGVuZ3RoID8gZmF2b3JpdGVzIDogPHA+Q2xpY2sgYW4gaW1hZ2UgdG8gbWFyayBpdCBhcyBhIGZhdm9yaXRlLjwvcD47XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGgyPkluc3RhZ3JhbSBQb3B1bGFyPC9oMj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpY3R1cmVzXCI+XG4gICAgICAgICAgICAgICAge3BpY3R1cmVzfVxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8aDI+WW91ciBGYXZvcml0ZXM8L2gyPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmF2b3JpdGVzXCI+XG4gICAgICAgICAgICAgICAge2Zhdm9yaXRlc31cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICApLFxuICAgIH07XG4gIH0pO1xuXG4gIGxldCBJbnRlbnQgPSBDeWNsZS5jcmVhdGVJbnRlbnQoVXNlciA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNoYW5nZVZhbHVlJDogVXNlci5ldmVudCQoXCJbdHlwZT1yYW5nZV1cIiwgXCJpbnB1dFwiKVxuICAgICAgICAubWFwKGV2ZW50ID0+IHBhcnNlSW50KGV2ZW50LnRhcmdldC52YWx1ZSkpLFxuXG4gICAgICBjaGFuZ2VDb2xvciQ6IFVzZXIuZXZlbnQkKFwiW3R5cGU9dGV4dF1cIiwgXCJpbnB1dFwiKVxuICAgICAgICAubWFwKGV2ZW50ID0+IGV2ZW50LnRhcmdldC52YWx1ZSksXG5cbiAgICAgIHJlbW92ZSQ6IFVzZXIuZXZlbnQkKFwiLmJ0bi5yZW1vdmVcIiwgXCJjbGlja1wiKVxuICAgICAgICAubWFwKGV2ZW50ID0+IHRydWUpLFxuICAgIH07XG5cblxuICAgIGZhdnVwQ2xpY2soaWQpe1xuICAgIC8vIGlkIGhvbGRzIHRoZSBJRCBvZiB0aGUgcGljdHVyZSB0aGF0IHdhcyBjbGlja2VkLlxuICAgIC8vIEZpbmQgaXQgaW4gdGhlIHBpY3R1cmVzIGFycmF5LCBhbmQgYWRkIGl0IHRvIHRoZSBmYXZvcml0ZXNcbiAgICBsZXQgZmF2b3JpdGVzID0gdGhpcy5zdGF0ZS5mYXZvcml0ZXMsXG4gICAgICAgIHBpY3R1cmVzID0gdGhpcy5zdGF0ZS5waWN0dXJlcztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGljdHVyZXMubGVuZ3RoOyBpKyspe1xuICAgICAgLy8gRmluZCB0aGUgaWQgaW4gdGhlIHBpY3R1cmVzIGFycmF5XG4gICAgICBpZiAocGljdHVyZXNbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgaWYgKHBpY3R1cmVzW2ldLmZhdm9yaXRlKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZhdm9yaXRlQ2xpY2soaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHRoZSBwaWN0dXJlIHRvIHRoZSBmYXZvcml0ZXMgYXJyYXksXG4gICAgICAgIC8vIGFuZCBtYXJrIGl0IGFzIGEgZmF2b3JpdGU6XG4gICAgICAgIGZhdm9yaXRlcy5wdXNoKHBpY3R1cmVzW2ldKTtcbiAgICAgICAgcGljdHVyZXNbaV0uZmF2b3JpdGUgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gVXBkYXRlIHRoZSBzdGF0ZSBhbmQgdHJpZ2dlciBhIHJlbmRlclxuICAgIHRoaXMuc2V0U3RhdGUoe3BpY3R1cmVzOiBwaWN0dXJlcywgZmF2b3JpdGVzOiBmYXZvcml0ZXN9KTtcbiAgfSxcblxuICB1bmZhdkNsaWNrKGlkKXtcbiAgICAvLyBGaW5kIHRoZSBwaWN0dXJlIGluIHRoZSBmYXZvcml0ZXMgYXJyYXkgYW5kIHJlbW92ZSBpdC4gQWZ0ZXIgdGhpcyxcbiAgICAvLyBmaW5kIHRoZSBwaWN0dXJlIGluIHRoZSBwaWN0dXJlcyBhcnJheSBhbmQgbWFyayBpdCBhcyBhIG5vbi1mYXZvcml0ZS5cbiAgICBsZXQgZmF2b3JpdGVzID0gdGhpcy5zdGF0ZS5mYXZvcml0ZXMsXG4gICAgICBwaWN0dXJlcyA9IHRoaXMuc3RhdGUucGljdHVyZXM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZhdm9yaXRlcy5sZW5ndGg7IGkrKyl7XG4gICAgICBpZiAoZmF2b3JpdGVzW2ldLmlkID09IGlkKSBicmVhaztcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdGhlIHBpY3R1cmUgZnJvbSBmYXZvcml0ZXMgYXJyYXlcbiAgICBmYXZvcml0ZXMuc3BsaWNlKGksIDEpO1xuXG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgcGljdHVyZXMubGVuZ3RoOyBpKyspe1xuICAgICAgaWYgKHBpY3R1cmVzW2ldLmlkID09IGlkKSB7XG4gICAgICAgIHBpY3R1cmVzW2ldLmZhdm9yaXRlID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgc3RhdGUgYW5kIHRyaWdnZXIgYSByZW5kZXJcbiAgICB0aGlzLnNldFN0YXRlKHtwaWN0dXJlczogcGljdHVyZXMsIGZhdm9yaXRlczogZmF2b3JpdGVzfSk7XG4gIH0sXG4gIH0pO1xuXG4gIFVzZXIuaW5qZWN0KFZpZXcpLmluamVjdChQcm9wcyk7XG59KTtcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgLy8gVGhlIHBpY3R1cmVzIGFycmF5IHdpbGwgYmUgcG9wdWxhdGVkIHZpYSBBSkFYLCBhbmRcbiAgICAvLyB0aGUgZmF2b3JpdGVzIG9uZSB3aGVuIHRoZSB1c2VyIGNsaWNrcyBvbiBhbiBpbWFnZTpcbiAgICByZXR1cm4ge1xuICAgICAgcGljdHVyZXM6IFtdLFxuICAgICAgZmF2b3JpdGVzOiBbXVxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gV2hlbiB0aGUgY29tcG9uZW50IGxvYWRzLCBzZW5kIGEgalF1ZXJ5IEFKQVggcmVxdWVzdFxuICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgIC8vIEFQSSBlbmRwb2ludCBmb3IgSW5zdGFncmFtXCJzIHBvcHVsYXIgaW1hZ2VzIGZvciB0aGUgZGF5XG4gICAgbGV0IHVybCA9IFwiaHR0cHM6Ly9hcGkuaW5zdGFncmFtLmNvbS92MS9tZWRpYS9wb3B1bGFyP2NsaWVudF9pZD1cIiArIHRoaXMucHJvcHMuYXBpS2V5ICsgXCImY2FsbGJhY2s9P1wiO1xuXG4gICAgJC5nZXRKU09OKHVybCwgZnVuY3Rpb24gKHJlc3VsdCl7XG4gICAgICBpZiAoIXJlc3VsdCB8fCAhcmVzdWx0LmRhdGEgfHwgIXJlc3VsdC5kYXRhLmxlbmd0aCl7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGxldCBwaWN0dXJlcyA9IHJlc3VsdC5kYXRhLm1hcChmdW5jdGlvbiAocCl7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IHAuaWQsXG4gICAgICAgICAgdXJsOiBwLmxpbmssXG4gICAgICAgICAgc3JjOiBwLmltYWdlcy5sb3dfcmVzb2x1dGlvbi51cmwsXG4gICAgICAgICAgdGl0bGU6IHAuY2FwdGlvbiA/IHAuY2FwdGlvbi50ZXh0IDogXCJcIixcbiAgICAgICAgICBmYXZvcml0ZTogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBVcGRhdGUgdGhlIGNvbXBvbmVudFwicyBzdGF0ZS4gVGhpcyB3aWxsIHRyaWdnZXIgYSByZW5kZXIuXG4gICAgICAvLyBOb3RlIHRoYXQgdGhpcyBvbmx5IHVwZGF0ZXMgdGhlIHBpY3R1cmVzIHByb3BlcnR5LCBhbmQgZG9lc1xuICAgICAgLy8gbm90IHJlbW92ZSB0aGUgZmF2b3JpdGVzIGFycmF5LlxuICAgICAgc2VsZi5zZXRTdGF0ZSh7IHBpY3R1cmVzOiBwaWN0dXJlcyB9KTtcbiAgICB9KTtcbiAgfSxcbn0pO1xuKi8iLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7UngsIGh9ID0gQ3ljbGU7XG5cbi8vIFZJRVdTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4gKHtcbiAgdnRyZWUkOiBNb2RlbC5nZXQoXCJwaWN0dXJlcyRcIikubWFwKHBpY3R1cmVzID0+IChcbiAgICBoKCdkaXYnLCBudWxsLCBbXG4gICAgICBoKCdoMicsIG51bGwsIFtcIlBpY3R1cmVzXCJdKSxcbiAgICAgIGgoJ1BpY3R1cmVzJywge2RhdGE6IHBpY3R1cmVzLmZpbHRlcihtID0+ICFtLmZhdm9yaXRlKX0pLFxuXG4gICAgICBoKCdoMicsIG51bGwsIFtcIkZhdm9yaXRlc1wiXSksXG4gICAgICBoKCdQaWN0dXJlcycsIHtkYXRhOiBwaWN0dXJlcy5maWx0ZXIobSA9PiBtLmZhdm9yaXRlKX0pXG4gICAgXSlcbiAgKSksXG59KSk7IiwiLy8gSU1QT1JUUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxucmVxdWlyZShcImJhYmVsL3BvbHlmaWxsXCIpO1xuXG4vLyBTSElNUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgQ3ljbGUgPSByZXF1aXJlKFwiY3ljbGVqc1wiKTtcbmxldCB7Unh9ID0gQ3ljbGU7XG5cbkN5Y2xlLmxhdGVzdCA9IGZ1bmN0aW9uIChEYXRhTm9kZSwga2V5cywgcmVzdWx0U2VsZWN0b3IpIHtcbiAgbGV0IG9ic2VydmFibGVzID0ga2V5cy5tYXAoa2V5ID0+IERhdGFOb2RlLmdldChrZXkpKTtcbiAgbGV0IGFyZ3MgPSBvYnNlcnZhYmxlcy5jb25jYXQoW1xuICAgIGZ1bmN0aW9uIHNlbGVjdG9yKC4uLmxpc3QpIHtcbiAgICAgIGxldCBpdGVtID0ga2V5cy5yZWR1Y2UoKGl0ZW0sIGtleSkgPT4ge1xuICAgICAgICBpdGVtW2tleS5zbGljZSgwLCAtMSldID0gbGlzdFtrZXlzLmluZGV4T2Yoa2V5KV07XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfSwge30pO1xuICAgICAgcmV0dXJuIHJlc3VsdFNlbGVjdG9yKGl0ZW0pO1xuICAgIH1cbiAgXSk7XG4gIHJldHVybiBSeC5PYnNlcnZhYmxlLmNvbWJpbmVMYXRlc3QuYXBwbHkobnVsbCwgYXJncyk7XG59O1xuXG5jb25zb2xlLnNweSA9IGZ1bmN0aW9uIHNweSguLi5wYXJhbXMpIHtcbiAgcmV0dXJuIGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSwgLi4ucGFyYW1zKTtcbn07Il19
