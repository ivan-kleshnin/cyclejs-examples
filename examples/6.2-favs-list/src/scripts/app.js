// IMPORTS =========================================================================================
require("./shims");
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Pictures = require("./pictures");
let Picture = require("./picture");

// APP =============================================================================================
let Model = Cycle.createModel(Intent => {
  let favup$ = Intent.get("favup$").map(src => {
    return function transform(pictures) {
      let picture = pictures.filter(picture => picture.src == src)[0];
      console.log("Favup:", src);
      picture.favorite = true;
      return pictures;
    };
  });

  let unfav$ = Intent.get("unfav$").map(src => {
    return function transform(pictures) {
      let picture = pictures.filter(picture => picture.src == src)[0];
      console.log("Unfav:", src);
      picture.favorite = false;
      return pictures;
    };
  });

  let transforms = Rx.Observable.merge(favup$, unfav$);

  let pictures = [
    {
      src: "https://avatars3.githubusercontent.com/u/984368?v=3&s=400",
      title: "RxJS",
      favorite: true
    },
    {
      src: "https://pbs.twimg.com/media/B5AJRfWCYAAbLyJ.png",
      title: "CycleJS",
      favorite: true
    },
    {
      src: "https://github.com/facebook/react/wiki/react-logo-1000-transparent.png",
      title: "ReactJS",
      favorite: false
    },
    {
      src: "https://lh6.googleusercontent.com/-TlY7amsfzPs/T9ZgLXXK1cI/AAAAAAABK-c/Ki-inmeYNKk/w749-h794/AngularJS-Shield-large.png",
      title: "AngularJS",
      favorite: false
    },
    {
      src: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQupntxEaHEhSpsINjI3n5TQN-oreFn0dEASi6dtGQUARo3UZg-Xxi_NA",
      title: "jQuery",
      favorite: false
    },
  ];

  return {
    pictures$: transforms
      .startWith(pictures)
      .scan((pictures, transform) => {
        let result = transform(pictures);
        return result;
      })
  };
});

let View = Cycle.createView(Model => ({
  vtree$: Model.get("pictures$").map(pictures => (
    <div>
      <h2>Pictures</h2>
      <Pictures data={pictures.filter(m => !m.favorite)}/>

      <h2>Favorites</h2>
      <Pictures data={pictures.filter(m => m.favorite)}/>
    </div>
  )),
}));

let Intent = Cycle.createIntent(User => ({
  favup$: User.event$(".pictures", "favup").map(event => event.data),
  unfav$: User.event$(".pictures", "unfav").map(event => event.data),
}));

let User = Cycle.createDOMUser("main");

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