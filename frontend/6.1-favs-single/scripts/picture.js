// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let Class = require("classnames");

// COMPONENTS ======================================================================================
let props = {
  src$: null,
  title$: null,
  favorite$: null,
  width$: null,
};

export default Cycle.registerCustomElement("Picture", (User, Props) => {
  let Model = Cycle.createModel((Intent, Props) => ({
    src$: Props.get("src$").startWith("#").shareReplay(1), // `src$` is exposed so `shareReplay` is required

    title$: Props.get("title$").startWith(""),

    favorite$: Props.get("favorite$")
      .merge(Intent.get("toggle$"))
      .scan(false, favorite => !favorite)
      .startWith(false),

    width$: Props.get("width$").startWith(100),
  }));

  let View = Cycle.createView(Model => {
    return {
      vtree$: Cycle.latest(Model, Object.keys(props), model => {
          return (
            <div class={Class({picture: true, favorite: model.favorite})}>
              <img src={model.src} width={model.width} title={model.title}/>
            </div>
          );
        }
      ),
    };
  });

  let Intent = Cycle.createIntent(User => {
    return {
      toggle$: User.event$(".picture", "click").map(() => true),
    };
  });

  User.inject(View).inject(Model).inject(Intent, Props)[0].inject(User);

  return {
    // As Model::favorite$ already dependes on Intent::toggle$ we can only use `.withLatestFrom`
    // `.flatMap(Model.get("favorite$"))` would create new observables at every step (circular dependency => memory leak)
    favup$: Intent.get("toggle$")
      .withLatestFrom(Model.get("favorite$"), (_, fav) => fav)
      .filter(v => !v)
      .flatMap(Model.get("src$")),

    unfav$: Intent.get("toggle$")
      .withLatestFrom(Model.get("favorite$"), (_, fav) => fav)
      .filter(v => v)
      .flatMap(Model.get("src$")),
  };
});