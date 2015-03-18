// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let makeClass = require("classnames");

// APP =============================================================================================
Cycle.registerCustomElement("Menu", (DOM, Props) => {
  let Model = Cycle.createModel(Intent => {
    return {
      active$: Intent.get("selectActive$").startWith(0),
    };
  });

  let View = Cycle.createView((Model, Props) => {
    let active$ = Model.get("active$");
    let items$ = Props.get("items$");
    return {
      vtree$: active$.combineLatest(items$, (active, items) => {
        return (
          <div>
            <ul>
              {items.map((item, i) =>
                (<li attributes={{"data-index": i}} key={i} class={makeClass({"menu-item": true, active: i == active})}>{item}</li>)
              )}
            </ul>
            <p>Selected: <b>{items[active]}</b></p>
          </div>
        );
      }),
      // TODO https://github.com/alexmingoia/jsx-transform/issues/15
    };
  });

  let Intent = Cycle.createIntent(DOM => {
    return {
      selectActive$: DOM.event$(".menu-item", "click").map(event => event.target.dataset.index),
    };
  });

  DOM.inject(View).inject(Model, Props)[0].inject(Intent).inject(DOM);
});

let View = Cycle.createView(() => {
  return {
    vtree$: Rx.Observable.return(h("Menu", {items: ["Home", "Services", "About", "Contact us"]})),
  };
});

Cycle.createDOMUser("main").inject(View);