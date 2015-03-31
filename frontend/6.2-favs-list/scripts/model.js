// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// MODELS ==========================================================================================
export default Cycle.createModel(Intent => {
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