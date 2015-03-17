// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("item", (DOM, Props) => {
  let View = Cycle.createView(Model => {
    return {
      vtree$: Rx.Observable.combineLatest(
        Model.get("id$"), Model.get("width$"),
        function(id, width) {
          return (
            <div class="item" style={{width: width + "px"}}>
              <div class="slider-container">
                <input class="width-slider" type="range" min="200" max="1000" data-id={id} value={width}/>
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
    };
  });

  let Intent = Cycle.createIntent(DOM => {
    return {
      remove$: DOM.event$(".remove", "click").map(event => true),
      changeWidth$: DOM.event$(".width-slider", "input").map(event => parseInt(event.target.value)),
    };
  });

  DOM.inject(View).inject(Model).inject(Intent, Props)[0].inject(DOM);

  return {
    remove$: Intent.get("remove$")
      .withLatestFrom(Model.get("id$"), (_, id) => id),

    changeWidth$: Intent.get("changeWidth$")
      .withLatestFrom(Model.get("id$"), (width, id) => ({id, width})),
  };
});
