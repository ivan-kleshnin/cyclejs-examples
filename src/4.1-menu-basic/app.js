// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let makeClass = require("classnames");

// APP =============================================================================================
Cycle.registerCustomElement("Menu", (DOM, Props) => {
  let Model = Cycle.createModel((Intent, Props) => {
    return {
      items$: Props.get("items$").startWith(["Home", "Feedback"]),
      active$: Intent.get("selectActive$").startWith(0),
    };
  });

  let View = Cycle.createView(Model => {
    let active$ = Model.get("active$");
    let items$ = Model.get("items$");
    return {
      vtree$: active$.combineLatest(items$, (active, items) => {
        return (
          <div>
            <ul>
              {items.map((item, i) =>
                (<li attributes={{"data-index": i}} key={i} class={makeClass({"menu-item": true, active: active == i})}>{item}</li>)
              )}
            </ul>
          </div>
        );
      }),
      // TODO <p>Selected: {Props.items[active]}</p>
      // TODO https://github.com/alexmingoia/jsx-transform/issues/15
    };
  });

  let Intent = Cycle.createIntent(DOM => {
    return {
      selectActive$: DOM.event$("", "click").map(event => event.target.dataset.index),
    };
  });

  DOM.inject(View).inject(Model).inject(Intent, Props)[0].inject(DOM);
});

let View = Cycle.createView(() => {
  return {
    vtree$: Rx.Observable.return(h("Menu", {items: ["Home", "Services", "About", "Contact us"]})),
  };
});

Cycle.createDOMUser("main").inject(View);