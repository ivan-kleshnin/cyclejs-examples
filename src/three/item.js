// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("item", (DOM, Properties) => {
  let View = Cycle.createView(Model => {
    return {
      vtree$: Rx.Observable.combineLatest(
        Model.get("id$"), Model.get("width$"),
        function(id, width) {
          return (
            <div className="item" style={{width: width + "px"}}>
              <div class="slider-container">
                <input class="width-slider" type="range" min="200" max="1000" data-id={id} value={width}/>
              </div>
            </div>
          );
        }
      ),
    };
  });

  let Model = Cycle.createModel((Intent, Props) => {
    return {
      id$: Props.get("id$"),
      width$: Props.get("width$"),
    };
  });

  let Intent = Cycle.createIntent(DOM => {
    return {
      remove$: DOM.event$(".remove", "click").map(event => event.target.value),
      changeWidth$: DOM.event$(".width-slider", "input").map(event => event.target.value)
    };
  });

  DOM.inject(View).inject(Model).inject(Intent, Properties)[0].inject(DOM);

  return {
    remove$: Intent.get("remove$"),
    changeWidth$: Intent.get("changeWidth$"),
  };
});
