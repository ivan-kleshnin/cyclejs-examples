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

// APP =============================================================================================
//https://pbs.twimg.com/media/B5AJRfWCYAAbLyJ.png

// Render the PictureList component, and add it to body.
// I am using an API key for a Instagram test ap. Please generate and
// use your own from here http://instagram.com/developer/
//React.renderComponent(
//  <PictureList apiKey="642176ece1e7445e99244cec26f4de1f" />,
//  document.querySelector("main")
//);
//
//React.renderComponent(
//  <PictureList apiKey="642176ece1e7445e99244cec26f4de1f" />,
//  document.querySelector("main")
//);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9zY3JpcHRzL2FwcC5qcyIsImJ1aWxkL3NjcmlwdHMvcGljdHVyZS5qcyIsImJ1aWxkL3NjcmlwdHMvcGljdHVyZXMuanMiLCJidWlsZC9zY3JpcHRzL3NoaW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FDQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25CLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMxQixFQUFFLEdBQU8sS0FBSyxDQUFkLEVBQUU7SUFBRSxDQUFDLEdBQUksS0FBSyxDQUFWLENBQUM7O0FBQ1YsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3JDLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7O0FBR25DLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDdEMsTUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDM0MsV0FBTyxTQUFTLFNBQVMsQ0FBQyxRQUFRLEVBQUU7QUFDbEMsVUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFBLE9BQU87ZUFBSSxPQUFPLENBQUMsR0FBRyxJQUFJLEdBQUc7T0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEUsYUFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDM0IsYUFBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEIsYUFBTyxRQUFRLENBQUM7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LENBQUMsQ0FBQztBQUNQLFdBQU8sY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQzlCLENBQ0YsQ0FBQyxDQUFDO0FBQ0gsU0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ3RELENBQUM7O0FBRUYsT0FBTyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsR0FBWTs7O29DQUFSLE1BQU07QUFBTixVQUFNOzs7QUFDbEMsU0FBTyxnQkFBQSxPQUFPLENBQUMsR0FBRyxFQUFDLElBQUksTUFBQSxnQkFBQyxPQUFPLFNBQUssTUFBTSxFQUFDLENBQUM7Q0FDN0MsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBJTVBPUlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5yZXF1aXJlKFwiLi9zaGltc1wiKTtcbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcbmxldCBQaWN0dXJlcyA9IHJlcXVpcmUoXCIuL3BpY3R1cmVzXCIpO1xubGV0IFBpY3R1cmUgPSByZXF1aXJlKFwiLi9waWN0dXJlXCIpO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgTW9kZWwgPSBDeWNsZS5jcmVhdGVNb2RlbChJbnRlbnQgPT4ge1xuICBsZXQgZmF2dXAkID0gSW50ZW50LmdldChcImZhdnVwJFwiKS5tYXAoc3JjID0+IHtcbiAgICByZXR1cm4gZnVuY3Rpb24gdHJhbnNmb3JtKHBpY3R1cmVzKSB7XG4gICAgICBsZXQgcGljdHVyZSA9IHBpY3R1cmVzLmZpbHRlcihwaWN0dXJlID0+IHBpY3R1cmUuc3JjID09IHNyYylbMF07XG4gICAgICBjb25zb2xlLmxvZyhcIkZhdnVwOlwiLCBzcmMpO1xuICAgICAgcGljdHVyZS5mYXZvcml0ZSA9IHRydWU7XG4gICAgICByZXR1cm4gcGljdHVyZXM7XG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IHVuZmF2JCA9IEludGVudC5nZXQoXCJ1bmZhdiRcIikubWFwKHNyYyA9PiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHRyYW5zZm9ybShwaWN0dXJlcykge1xuICAgICAgbGV0IHBpY3R1cmUgPSBwaWN0dXJlcy5maWx0ZXIocGljdHVyZSA9PiBwaWN0dXJlLnNyYyA9PSBzcmMpWzBdO1xuICAgICAgY29uc29sZS5sb2coXCJVbmZhdjpcIiwgc3JjKTtcbiAgICAgIHBpY3R1cmUuZmF2b3JpdGUgPSBmYWxzZTtcbiAgICAgIHJldHVybiBwaWN0dXJlcztcbiAgICB9O1xuICB9KTtcblxuICBsZXQgdHJhbnNmb3JtcyA9IFJ4Lk9ic2VydmFibGUubWVyZ2UoZmF2dXAkLCB1bmZhdiQpO1xuXG4gIGxldCBwaWN0dXJlcyA9IFtcbiAgICB7XG4gICAgICBzcmM6IFwiaHR0cHM6Ly9hdmF0YXJzMy5naXRodWJ1c2VyY29udGVudC5jb20vdS85ODQzNjg/dj0zJnM9NDAwXCIsXG4gICAgICB0aXRsZTogXCJSeEpTXCIsXG4gICAgICBmYXZvcml0ZTogdHJ1ZVxuICAgIH0sXG4gICAge1xuICAgICAgc3JjOiBcImh0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CNUFKUmZXQ1lBQWJMeUoucG5nXCIsXG4gICAgICB0aXRsZTogXCJDeWNsZUpTXCIsXG4gICAgICBmYXZvcml0ZTogdHJ1ZVxuICAgIH0sXG4gICAge1xuICAgICAgc3JjOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC93aWtpL3JlYWN0LWxvZ28tMTAwMC10cmFuc3BhcmVudC5wbmdcIixcbiAgICAgIHRpdGxlOiBcIlJlYWN0SlNcIixcbiAgICAgIGZhdm9yaXRlOiBmYWxzZVxuICAgIH0sXG4gICAge1xuICAgICAgc3JjOiBcImh0dHBzOi8vbGg2Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tVGxZN2Ftc2Z6UHMvVDlaZ0xYWEsxY0kvQUFBQUFBQUJLLWMvS2ktaW5tZVlOS2svdzc0OS1oNzk0L0FuZ3VsYXJKUy1TaGllbGQtbGFyZ2UucG5nXCIsXG4gICAgICB0aXRsZTogXCJBbmd1bGFySlNcIixcbiAgICAgIGZhdm9yaXRlOiBmYWxzZVxuICAgIH0sXG4gICAge1xuICAgICAgc3JjOiBcImh0dHBzOi8vZW5jcnlwdGVkLXRibjEuZ3N0YXRpYy5jb20vaW1hZ2VzP3E9dGJuOkFOZDlHY1F1cG50eEVhSEVoU3BzSU5qSTNuNVRRTi1vcmVGbjBkRUFTaTZkdEdRVUFSbzNVWmctWHhpX05BXCIsXG4gICAgICB0aXRsZTogXCJqUXVlcnlcIixcbiAgICAgIGZhdm9yaXRlOiBmYWxzZVxuICAgIH0sXG4gIF07XG5cbiAgcmV0dXJuIHtcbiAgICBwaWN0dXJlcyQ6IHRyYW5zZm9ybXNcbiAgICAgIC5zdGFydFdpdGgocGljdHVyZXMpXG4gICAgICAuc2NhbigocGljdHVyZXMsIHRyYW5zZm9ybSkgPT4ge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdHJhbnNmb3JtKHBpY3R1cmVzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0pXG4gIH07XG59KTtcblxubGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KE1vZGVsID0+ICh7XG4gIHZ0cmVlJDogTW9kZWwuZ2V0KFwicGljdHVyZXMkXCIpLm1hcChwaWN0dXJlcyA9PiAoXG4gICAgaCgnZGl2JywgbnVsbCwgW1xuICAgICAgaCgnaDInLCBudWxsLCBbXCJQaWN0dXJlc1wiXSksXG4gICAgICBoKCdQaWN0dXJlcycsIHtkYXRhOiBwaWN0dXJlcy5maWx0ZXIobSA9PiAhbS5mYXZvcml0ZSl9KSxcblxuICAgICAgaCgnaDInLCBudWxsLCBbXCJGYXZvcml0ZXNcIl0pLFxuICAgICAgaCgnUGljdHVyZXMnLCB7ZGF0YTogcGljdHVyZXMuZmlsdGVyKG0gPT4gbS5mYXZvcml0ZSl9KVxuICAgIF0pXG4gICkpLFxufSkpO1xuXG5sZXQgSW50ZW50ID0gQ3ljbGUuY3JlYXRlSW50ZW50KFVzZXIgPT4gKHtcbiAgZmF2dXAkOiBVc2VyLmV2ZW50JChcIi5waWN0dXJlc1wiLCBcImZhdnVwXCIpLm1hcChldmVudCA9PiBldmVudC5kYXRhKSxcbiAgdW5mYXYkOiBVc2VyLmV2ZW50JChcIi5waWN0dXJlc1wiLCBcInVuZmF2XCIpLm1hcChldmVudCA9PiBldmVudC5kYXRhKSxcbn0pKTtcblxubGV0IFVzZXIgPSBDeWNsZS5jcmVhdGVET01Vc2VyKFwibWFpblwiKTtcblxuVXNlci5pbmplY3QoVmlldykuaW5qZWN0KE1vZGVsKS5pbmplY3QoSW50ZW50KS5pbmplY3QoVXNlcik7XG5cbi8vIE5vdCBzdXBwb3J0ZWQgeWV0IVxuLy9Vc2VyLmV2ZW50JChcIlBpY3R1cmVcIiwgXCJjbGlja1wiKS5zdWJzY3JpYmUoLi4uKTtcbi8vVXNlci5ldmVudCQoXCJQaWN0dXJlXCIsIFwiZmF2dXBcIikuc3Vic2NyaWJlKC4uLik7XG4vL1VzZXIuZXZlbnQkKFwiUGljdHVyZVwiLCBcInVuZmF2XCIpLnN1YnNjcmliZSguLi4pO1xuXG4vLyBBUFAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vL2h0dHBzOi8vcGJzLnR3aW1nLmNvbS9tZWRpYS9CNUFKUmZXQ1lBQWJMeUoucG5nXG5cbi8vIFJlbmRlciB0aGUgUGljdHVyZUxpc3QgY29tcG9uZW50LCBhbmQgYWRkIGl0IHRvIGJvZHkuXG4vLyBJIGFtIHVzaW5nIGFuIEFQSSBrZXkgZm9yIGEgSW5zdGFncmFtIHRlc3QgYXAuIFBsZWFzZSBnZW5lcmF0ZSBhbmRcbi8vIHVzZSB5b3VyIG93biBmcm9tIGhlcmUgaHR0cDovL2luc3RhZ3JhbS5jb20vZGV2ZWxvcGVyL1xuLy9SZWFjdC5yZW5kZXJDb21wb25lbnQoXG4vLyAgPFBpY3R1cmVMaXN0IGFwaUtleT1cIjY0MjE3NmVjZTFlNzQ0NWU5OTI0NGNlYzI2ZjRkZTFmXCIgLz4sXG4vLyAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIilcbi8vKTtcbi8vXG4vL1JlYWN0LnJlbmRlckNvbXBvbmVudChcbi8vICA8UGljdHVyZUxpc3QgYXBpS2V5PVwiNjQyMTc2ZWNlMWU3NDQ1ZTk5MjQ0Y2VjMjZmNGRlMWZcIiAvPixcbi8vICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKVxuLy8pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcbmxldCBDbGFzcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5sZXQgcHJvcHMgPSB7XG4gIHNyYyQ6IG51bGwsXG4gIHRpdGxlJDogbnVsbCxcbiAgZmF2b3JpdGUkOiBudWxsLFxuICB3aWR0aCQ6IG51bGwsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBDeWNsZS5yZWdpc3RlckN1c3RvbUVsZW1lbnQoXCJQaWN0dXJlXCIsIChVc2VyLCBQcm9wcykgPT4ge1xuICBsZXQgTW9kZWwgPSBDeWNsZS5jcmVhdGVNb2RlbCgoSW50ZW50LCBQcm9wcykgPT4gKHtcbiAgICBzcmMkOiBQcm9wcy5nZXQoXCJzcmMkXCIpLnN0YXJ0V2l0aChcIiNcIikuc2hhcmVSZXBsYXkoMSksIC8vIGBzcmMkYCBpcyBleHBvc2VkIHNvIGBzaGFyZVJlcGxheWAgaXMgcmVxdWlyZWRcblxuICAgIHRpdGxlJDogUHJvcHMuZ2V0KFwidGl0bGUkXCIpLnN0YXJ0V2l0aChcIlwiKSxcblxuICAgIGZhdm9yaXRlJDogUHJvcHMuZ2V0KFwiZmF2b3JpdGUkXCIpXG4gICAgICAubWVyZ2UoSW50ZW50LmdldChcInRvZ2dsZSRcIikpXG4gICAgICAuc2NhbihmYXZvcml0ZSA9PiAhZmF2b3JpdGUpXG4gICAgICAvLy5kaXN0aW5jdFVudGlsQ2hhbmdlZCgpXG4gICAgICAuc3RhcnRXaXRoKGZhbHNlKVxuICAgICAgLnNoYXJlUmVwbGF5KDEpLFxuXG4gICAgd2lkdGgkOiBQcm9wcy5nZXQoXCJ3aWR0aCRcIikuc3RhcnRXaXRoKDEwMCksXG4gIH0pKTtcblxuICBsZXQgVmlldyA9IEN5Y2xlLmNyZWF0ZVZpZXcoTW9kZWwgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB2dHJlZSQ6IEN5Y2xlLmxhdGVzdChNb2RlbCwgT2JqZWN0LmtleXMocHJvcHMpLCBtb2RlbCA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IENsYXNzKHtwaWN0dXJlOiB0cnVlLCBmYXZvcml0ZTogbW9kZWwuZmF2b3JpdGV9KX0sIFtcbiAgICAgICAgICAgICAgaCgnaW1nJywge3NyYzogbW9kZWwuc3JjLCB3aWR0aDogbW9kZWwud2lkdGgsIHRpdGxlOiBtb2RlbC50aXRsZX0pXG4gICAgICAgICAgICBdKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICksXG4gICAgfTtcbiAgfSk7XG5cbiAgbGV0IEludGVudCA9IEN5Y2xlLmNyZWF0ZUludGVudChVc2VyID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgdG9nZ2xlJDogVXNlci5ldmVudCQoXCIucGljdHVyZVwiLCBcImNsaWNrXCIpLm1hcCgoKSA9PiB0cnVlKSxcbiAgICB9O1xuICB9KTtcblxuICBVc2VyLmluamVjdChWaWV3KS5pbmplY3QoTW9kZWwpLmluamVjdChJbnRlbnQsIFByb3BzKVswXS5pbmplY3QoVXNlcik7XG5cbiAgcmV0dXJuIHtcbiAgICBmYXZ1cCQ6IE1vZGVsLmdldChcImZhdm9yaXRlJFwiKS5maWx0ZXIodiA9PiB2KVxuICAgICAgLnNhbXBsZShJbnRlbnQuZ2V0KFwidG9nZ2xlJFwiKSlcbiAgICAgIC50YXAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGljdHVyZSBzYXlzIGZhdnVwJFwiKTtcbiAgICAgIH0pXG4gICAgICAud2l0aExhdGVzdEZyb20oTW9kZWwuZ2V0KFwic3JjJFwiKSwgKF8sIHNyYykgPT4gc3JjKSxcblxuICAgIHVuZmF2JDogTW9kZWwuZ2V0KFwiZmF2b3JpdGUkXCIpLmZpbHRlcih2ID0+ICF2KVxuICAgICAgLnNhbXBsZShJbnRlbnQuZ2V0KFwidG9nZ2xlJFwiKSlcbiAgICAgIC50YXAoZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUGljdHVyZSBzYXlzIHVuZmF2JFwiKTtcbiAgICAgIH0pXG4gICAgICAud2l0aExhdGVzdEZyb20oTW9kZWwuZ2V0KFwic3JjJFwiKSwgKF8sIHNyYykgPT4gc3JjKSxcbiAgfTtcbn0pOyIsIi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZWpzXCIpO1xubGV0IHtSeCwgaH0gPSBDeWNsZTtcbmxldCBDbGFzcyA9IHJlcXVpcmUoXCJjbGFzc25hbWVzXCIpO1xuXG4vLyBDT01QT05FTlRTID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBDeWNsZS5yZWdpc3RlckN1c3RvbUVsZW1lbnQoXCJQaWN0dXJlc1wiLCAoVXNlciwgUHJvcHMpID0+IHtcbiAgbGV0IE1vZGVsID0gQ3ljbGUuY3JlYXRlTW9kZWwoUHJvcHMgPT4gKHtcbiAgICBkYXRhJDogUHJvcHMuZ2V0KFwiZGF0YSRcIikuc3RhcnRXaXRoKFtdKSxcbiAgfSkpO1xuXG4gIGxldCBWaWV3ID0gQ3ljbGUuY3JlYXRlVmlldyhNb2RlbCA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZ0cmVlJDogTW9kZWwuZ2V0KFwiZGF0YSRcIikubWFwKGRhdGEgPT4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGgoJ2RpdicsIHtjbGFzc05hbWU6IFwicGljdHVyZXNcIn0sIFtcbiAgICAgICAgICAgIGRhdGEubWFwKG1vZGVsID0+IChcbiAgICAgICAgICAgICAgaCgnUGljdHVyZScsIHtzcmM6IG1vZGVsLnNyYywgdGl0bGU6IG1vZGVsLnRpdGxlLCBmYXZvcml0ZTogbW9kZWwuZmF2b3JpdGUsIHdpZHRoOiBcIjEwMFwifSlcbiAgICAgICAgICAgICkpXG4gICAgICAgICAgXSlcbiAgICAgICAgKTtcbiAgICAgIH0pLFxuICAgIH07XG4gIH0pO1xuXG4gIFVzZXIuaW5qZWN0KFZpZXcpLmluamVjdChNb2RlbCkuaW5qZWN0KFByb3BzKTtcblxuICByZXR1cm4ge1xuICAgIGZhdnVwJDogVXNlci5ldmVudCQoXCIucGljdHVyZVwiLCBcImZhdnVwXCIpLm1hcChldmVudCA9PiBldmVudC5kYXRhKSxcbiAgICB1bmZhdiQ6IFVzZXIuZXZlbnQkKFwiLnBpY3R1cmVcIiwgXCJ1bmZhdlwiKS5tYXAoZXZlbnQgPT4gZXZlbnQuZGF0YSksXG4gIH07XG59KTtcblxuLypcbi8vIElNUE9SVFMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmxldCBDeWNsZSA9IHJlcXVpcmUoXCJjeWNsZVwiKTtcbmxldCBQaWN0dXJlID0gcmVxdWlyZShcIi4vcGljdHVyZVwiKTtcblxuLy8gQ09NUE9ORU5UUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgQ3ljbGUucmVnaXN0ZXJDdXN0b21FbGVtZW50KFwiUGljdHVyZXNcIiwgKFVzZXIsIFByb3BzKSA9PiB7XG4gIGxldCBNb2RlbCA9IEN5Y2xlLmNyZWF0ZU1vZGVsKEludGVudCA9PiAoe1xuICAgIHBpY3R1cmVzJDogUHJvcHMuZ2V0KFwicGljdHVyZXMkXCIpLnN0YXJ0V2l0aChbXSksXG4gICAgZmF2b3JpdGVzJDogUHJvcHMuZ2V0KFwiZmF2b3JpdGVzJFwiKS5zdGFydFdpdGgoW10pLFxuICB9KSk7XG5cbiAgbGV0IFZpZXcgPSBDeWNsZS5jcmVhdGVWaWV3KE1vZGVsID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgdnRyZWUkOiBSeC5PYnNlcnZhYmxlLmNvbWJpbmVMYXRlc3QoXG4gICAgICAgIE1vZGVsLmdldChcInBpY3R1cmVzJFwiKSwgTW9kZWwuZ2V0KFwiZmF2b3JpdGVzJFwiKSxcbiAgICAgICAgKHBpY3R1cmVzLCBmYXZvcml0ZXMpID0+IHtcbiAgICAgICAgICBsZXQgcGljdHVyZXMgPSBwaWN0dXJlcy5tYXAocCA9PiA8UGljdHVyZSBzcmM9e3Auc3JjfSB0aXRsZT17cC50aXRsZX0gZmF2b3JpdGU9e3AuZmF2b3JpdGV9Lz4pO1xuICAgICAgICAgIHBpY3R1cmVzID0gcGljdHVyZXMubGVuZ3RoID8gcGljdHVyZXMgOiA8cD5Mb2FkaW5nIGltYWdlcy4uPC9wPjtcblxuICAgICAgICAgIGxldCBmYXZvcml0ZXMgPSBmYXZvcml0ZXMubWFwKHAgPT4gPFBpY3R1cmUgc3JjPXtwLnNyY30gdGl0bGU9e3AudGl0bGV9IGZhdm9yaXRlPXt0cnVlfS8+KTtcbiAgICAgICAgICBmYXZvcml0ZXMgPSBmYXZvcml0ZXMubGVuZ3RoID8gZmF2b3JpdGVzIDogPHA+Q2xpY2sgYW4gaW1hZ2UgdG8gbWFyayBpdCBhcyBhIGZhdm9yaXRlLjwvcD47XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGgyPkluc3RhZ3JhbSBQb3B1bGFyPC9oMj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBpY3R1cmVzXCI+XG4gICAgICAgICAgICAgICAge3BpY3R1cmVzfVxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8aDI+WW91ciBGYXZvcml0ZXM8L2gyPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmF2b3JpdGVzXCI+XG4gICAgICAgICAgICAgICAge2Zhdm9yaXRlc31cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICApLFxuICAgIH07XG4gIH0pO1xuXG4gIGxldCBJbnRlbnQgPSBDeWNsZS5jcmVhdGVJbnRlbnQoVXNlciA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNoYW5nZVZhbHVlJDogVXNlci5ldmVudCQoXCJbdHlwZT1yYW5nZV1cIiwgXCJpbnB1dFwiKVxuICAgICAgICAubWFwKGV2ZW50ID0+IHBhcnNlSW50KGV2ZW50LnRhcmdldC52YWx1ZSkpLFxuXG4gICAgICBjaGFuZ2VDb2xvciQ6IFVzZXIuZXZlbnQkKFwiW3R5cGU9dGV4dF1cIiwgXCJpbnB1dFwiKVxuICAgICAgICAubWFwKGV2ZW50ID0+IGV2ZW50LnRhcmdldC52YWx1ZSksXG5cbiAgICAgIHJlbW92ZSQ6IFVzZXIuZXZlbnQkKFwiLmJ0bi5yZW1vdmVcIiwgXCJjbGlja1wiKVxuICAgICAgICAubWFwKGV2ZW50ID0+IHRydWUpLFxuICAgIH07XG5cblxuICAgIGZhdnVwQ2xpY2soaWQpe1xuICAgIC8vIGlkIGhvbGRzIHRoZSBJRCBvZiB0aGUgcGljdHVyZSB0aGF0IHdhcyBjbGlja2VkLlxuICAgIC8vIEZpbmQgaXQgaW4gdGhlIHBpY3R1cmVzIGFycmF5LCBhbmQgYWRkIGl0IHRvIHRoZSBmYXZvcml0ZXNcbiAgICBsZXQgZmF2b3JpdGVzID0gdGhpcy5zdGF0ZS5mYXZvcml0ZXMsXG4gICAgICAgIHBpY3R1cmVzID0gdGhpcy5zdGF0ZS5waWN0dXJlcztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGljdHVyZXMubGVuZ3RoOyBpKyspe1xuICAgICAgLy8gRmluZCB0aGUgaWQgaW4gdGhlIHBpY3R1cmVzIGFycmF5XG4gICAgICBpZiAocGljdHVyZXNbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgaWYgKHBpY3R1cmVzW2ldLmZhdm9yaXRlKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZhdm9yaXRlQ2xpY2soaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHRoZSBwaWN0dXJlIHRvIHRoZSBmYXZvcml0ZXMgYXJyYXksXG4gICAgICAgIC8vIGFuZCBtYXJrIGl0IGFzIGEgZmF2b3JpdGU6XG4gICAgICAgIGZhdm9yaXRlcy5wdXNoKHBpY3R1cmVzW2ldKTtcbiAgICAgICAgcGljdHVyZXNbaV0uZmF2b3JpdGUgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gVXBkYXRlIHRoZSBzdGF0ZSBhbmQgdHJpZ2dlciBhIHJlbmRlclxuICAgIHRoaXMuc2V0U3RhdGUoe3BpY3R1cmVzOiBwaWN0dXJlcywgZmF2b3JpdGVzOiBmYXZvcml0ZXN9KTtcbiAgfSxcblxuICB1bmZhdkNsaWNrKGlkKXtcbiAgICAvLyBGaW5kIHRoZSBwaWN0dXJlIGluIHRoZSBmYXZvcml0ZXMgYXJyYXkgYW5kIHJlbW92ZSBpdC4gQWZ0ZXIgdGhpcyxcbiAgICAvLyBmaW5kIHRoZSBwaWN0dXJlIGluIHRoZSBwaWN0dXJlcyBhcnJheSBhbmQgbWFyayBpdCBhcyBhIG5vbi1mYXZvcml0ZS5cbiAgICBsZXQgZmF2b3JpdGVzID0gdGhpcy5zdGF0ZS5mYXZvcml0ZXMsXG4gICAgICBwaWN0dXJlcyA9IHRoaXMuc3RhdGUucGljdHVyZXM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZhdm9yaXRlcy5sZW5ndGg7IGkrKyl7XG4gICAgICBpZiAoZmF2b3JpdGVzW2ldLmlkID09IGlkKSBicmVhaztcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgdGhlIHBpY3R1cmUgZnJvbSBmYXZvcml0ZXMgYXJyYXlcbiAgICBmYXZvcml0ZXMuc3BsaWNlKGksIDEpO1xuXG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgcGljdHVyZXMubGVuZ3RoOyBpKyspe1xuICAgICAgaWYgKHBpY3R1cmVzW2ldLmlkID09IGlkKSB7XG4gICAgICAgIHBpY3R1cmVzW2ldLmZhdm9yaXRlID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgc3RhdGUgYW5kIHRyaWdnZXIgYSByZW5kZXJcbiAgICB0aGlzLnNldFN0YXRlKHtwaWN0dXJlczogcGljdHVyZXMsIGZhdm9yaXRlczogZmF2b3JpdGVzfSk7XG4gIH0sXG4gIH0pO1xuXG4gIFVzZXIuaW5qZWN0KFZpZXcpLmluamVjdChQcm9wcyk7XG59KTtcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgLy8gVGhlIHBpY3R1cmVzIGFycmF5IHdpbGwgYmUgcG9wdWxhdGVkIHZpYSBBSkFYLCBhbmRcbiAgICAvLyB0aGUgZmF2b3JpdGVzIG9uZSB3aGVuIHRoZSB1c2VyIGNsaWNrcyBvbiBhbiBpbWFnZTpcbiAgICByZXR1cm4ge1xuICAgICAgcGljdHVyZXM6IFtdLFxuICAgICAgZmF2b3JpdGVzOiBbXVxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgLy8gV2hlbiB0aGUgY29tcG9uZW50IGxvYWRzLCBzZW5kIGEgalF1ZXJ5IEFKQVggcmVxdWVzdFxuICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgIC8vIEFQSSBlbmRwb2ludCBmb3IgSW5zdGFncmFtXCJzIHBvcHVsYXIgaW1hZ2VzIGZvciB0aGUgZGF5XG4gICAgbGV0IHVybCA9IFwiaHR0cHM6Ly9hcGkuaW5zdGFncmFtLmNvbS92MS9tZWRpYS9wb3B1bGFyP2NsaWVudF9pZD1cIiArIHRoaXMucHJvcHMuYXBpS2V5ICsgXCImY2FsbGJhY2s9P1wiO1xuXG4gICAgJC5nZXRKU09OKHVybCwgZnVuY3Rpb24ocmVzdWx0KXtcbiAgICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQuZGF0YSB8fCAhcmVzdWx0LmRhdGEubGVuZ3RoKXtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGV0IHBpY3R1cmVzID0gcmVzdWx0LmRhdGEubWFwKGZ1bmN0aW9uKHApe1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBwLmlkLFxuICAgICAgICAgIHVybDogcC5saW5rLFxuICAgICAgICAgIHNyYzogcC5pbWFnZXMubG93X3Jlc29sdXRpb24udXJsLFxuICAgICAgICAgIHRpdGxlOiBwLmNhcHRpb24gPyBwLmNhcHRpb24udGV4dCA6IFwiXCIsXG4gICAgICAgICAgZmF2b3JpdGU6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgICAgLy8gVXBkYXRlIHRoZSBjb21wb25lbnRcInMgc3RhdGUuIFRoaXMgd2lsbCB0cmlnZ2VyIGEgcmVuZGVyLlxuICAgICAgLy8gTm90ZSB0aGF0IHRoaXMgb25seSB1cGRhdGVzIHRoZSBwaWN0dXJlcyBwcm9wZXJ0eSwgYW5kIGRvZXNcbiAgICAgIC8vIG5vdCByZW1vdmUgdGhlIGZhdm9yaXRlcyBhcnJheS5cbiAgICAgIHNlbGYuc2V0U3RhdGUoeyBwaWN0dXJlczogcGljdHVyZXMgfSk7XG4gICAgfSk7XG4gIH0sXG59KTtcbiovIiwicmVxdWlyZShcImJhYmVsL3BvbHlmaWxsXCIpO1xubGV0IEN5Y2xlID0gcmVxdWlyZShcImN5Y2xlanNcIik7XG5sZXQge1J4fSA9IEN5Y2xlO1xuXG5DeWNsZS5sYXRlc3QgPSBmdW5jdGlvbihEYXRhTm9kZSwga2V5cywgcmVzdWx0U2VsZWN0b3IpIHtcbiAgbGV0IG9ic2VydmFibGVzID0ga2V5cy5tYXAoa2V5ID0+IERhdGFOb2RlLmdldChrZXkpKTtcbiAgbGV0IGFyZ3MgPSBvYnNlcnZhYmxlcy5jb25jYXQoW1xuICAgIGZ1bmN0aW9uIHNlbGVjdG9yKC4uLmxpc3QpIHtcbiAgICAgIGxldCBtb2RlbCA9IGtleXMucmVkdWNlKChtb2RlbCwga2V5KSA9PiB7XG4gICAgICAgIG1vZGVsW2tleS5zbGljZSgwLCAtMSldID0gbGlzdFtrZXlzLmluZGV4T2Yoa2V5KV07XG4gICAgICAgIHJldHVybiBtb2RlbDtcbiAgICAgIH0sIHt9KTtcbiAgICAgIHJldHVybiByZXN1bHRTZWxlY3Rvcihtb2RlbCk7XG4gICAgfVxuICBdKTtcbiAgcmV0dXJuIFJ4Lk9ic2VydmFibGUuY29tYmluZUxhdGVzdC5hcHBseShudWxsLCBhcmdzKTtcbn07XG5cbmNvbnNvbGUuc3B5ID0gZnVuY3Rpb24gc3B5KC4uLnBhcmFtcykge1xuICByZXR1cm4gY29uc29sZS5sb2cuYmluZChjb25zb2xlLCAuLi5wYXJhbXMpO1xufTtcbiJdfQ==
