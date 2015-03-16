// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("item", (DOM, Properties) => {
  let View = Cycle.createView(Model => {
    return {
      vtree$: Rx.Observable.combineLatest(
        Model.get("width$"),
        (width) => {
          return (
            <div className="item" style={{width: width + "px"}}>
              <div class="slider-container">
                <input class="width-slider" type="range" min="200" max="1000" value={width}/>
              </div>
            </div>
          );
        }
      )
    };
  });

  let Model = Cycle.createModel((Intent, Props) => {
    return {
      width$: Props.get("width$").startWith(200),
    };
  });

  let Intent = Cycle.createIntent(DOM => {
    return {
      changeWidth$: DOM.event$(".width-slider", "input").map(event => event.target.value)
    };
  });

  DOM.inject(View).inject(Model).inject(Intent, Properties)[0].inject(DOM);

  return {
    changeWidth$: Intent.get("changeWidth$"),
  };
});
