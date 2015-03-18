// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("item", (DOM, Props) => {
  let Model = Cycle.createModel((Intent, Props) => {
    return {
      id$: Props.get("id$").shareReplay(1),
      width$: Props.get("width$"),
    };
  });

  let View = Cycle.createView(Model => {
    let id$ = Model.get("id$");
    let width$ = Model.get("width$");
    return {
      vtree$: Rx.Observable.combineLatest(id$, width$, (id, width) => {
          return (
            <div class="item" style={{width: width + "px"}}>
              <div>
                <input class="width-slider" type="range" min="200" max="1000" value={width}/>
              </div>
            </div>
          );
        }
      ),
    };
  });

  let Intent = Cycle.createIntent(DOM => {
    return {
      changeWidth$: DOM.event$(".width-slider", "input").map(event => parseInt(event.target.value)),
    };
  });

  DOM.inject(View).inject(Model).inject(Intent, Props)[0].inject(DOM);

  return {
    changeWidth$: Intent.get("changeWidth$")
      .withLatestFrom(Model.get("id$"), (width, id) => ({id, width})),
  };
});
