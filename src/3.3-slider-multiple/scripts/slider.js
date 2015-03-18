// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("Slider", (DOM, Props) => {
  let Model = Cycle.createModel((Intent, Props) => ({
    id$: Props.get("id$").shareReplay(1),
    width$: Props.get("width$").merge(Intent.get("changeWidth$")),
  }));

  let View = Cycle.createView(Model => {
    let id$ = Model.get("id$");
    let width$ = Model.get("width$");
    return {
      vtree$: width$.combineLatest(id$, (width, id) => (
        <div class="item" style={{width: width + "px"}}>
          <div>
            <input class="width-slider" type="range" min="200" max="1000" value={width}/>
          </div>
          <button class="remove">Remove</button>
        </div>
      )),
    };
  });

  let Intent = Cycle.createIntent(DOM => {
    return {
      changeWidth$: DOM.event$(".width-slider", "input").map(event => parseInt(event.target.value)),
      remove$: DOM.event$(".remove", "click").map(event => true),
    };
  });

  DOM.inject(View).inject(Model).inject(Intent, Props)[0].inject(DOM);

  return {
    changeWidth$: Intent.get("changeWidth$")
      .combineLatest(Model.get("id$"), (width, id) => ({id, width})),

    remove$: Intent.get("remove$")
      .combineLatest(Model.get("id$"), (_, id) => id),
  };
});
