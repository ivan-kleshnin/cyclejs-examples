// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("item", (DOM, Props) => {
  let View = Cycle.createView(Model => {
    let id$ = Model.get("id$");
    let width$ = Model.get("width$");
    let color$ = Model.get("color$");
    return {
      vtree$: Rx.Observable.combineLatest(id$, width$, color$, (id, width, color) => {
          return (
            <div class="item" style={{width: width + "px", backgroundColor: color}}>
              <div>
                <input class="width-slider" type="range" min="200" max="1000" value={width}/>
              </div>
              <div>
                <input class="color-input" type="text" value={color}/>
              </div>
              <button class="remove">Remove</button>
            </div>
          );
        }
      ),
    };
  });

  let Model = Cycle.createModel((Intent, Props) => {
    return {
      id$: Props.get("id$").shareReplay(1),
      width$: Props.get("width$"),
      color$: Props.get("color$"),
    };
  });

  let Intent = Cycle.createIntent(DOM => {
    return {
      changeWidth$: DOM.event$(".width-slider", "input").map(event => parseInt(event.target.value)),
      changeColor$: DOM.event$(".color-input", "input").map(event => event.target.value),
      remove$: DOM.event$(".remove", "click").map(event => true),
    };
  });

  DOM.inject(View).inject(Model).inject(Intent, Props)[0].inject(DOM);

  return {
    changeWidth$: Intent.get("changeWidth$")
      .withLatestFrom(Model.get("id$"), (width, id) => ({id, width})),

    changeColor$: Intent.get("changeColor$")
      .withLatestFrom(Model.get("id$"), (color, id) => ({id, color})),

    remove$: Intent.get("remove$")
      .withLatestFrom(Model.get("id$"), (_, id) => id),
  };
});
