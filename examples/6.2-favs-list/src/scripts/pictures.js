// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Class = require("classnames");

// COMPONENTS ======================================================================================
export default Cycle.registerCustomElement("Pictures", (User, Props) => {
  let Model = Cycle.createModel(Props => ({
    data$: Props.get("data$").startWith([]),
  }));

  let View = Cycle.createView(Model => {
    return {
      vtree$: Model.get("data$").map(data => {
        return (
          <div class="pictures">
            {data.map(model => (
              <Picture src={model.src} title={model.title} favorite={model.favorite} width="100"/>
            ))}
          </div>
        );
      }),
    };
  });

  User.inject(View).inject(Model).inject(Props);

  return {
    favup$: User.event$(".picture", "favup").map(event => event.data),
    unfav$: User.event$(".picture", "unfav").map(event => event.data),
  };
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