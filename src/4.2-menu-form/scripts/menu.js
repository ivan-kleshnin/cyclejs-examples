// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let makeClass = require("classnames");

// COMPONENTS ======================================================================================
Cycle.registerCustomElement("Menu", (DOM, Props) => {
  let Model = Cycle.createModel((Intent, Props) => {
    let items$ = Props.get("items$");
    let active$ = Props.get("active$");
    let selectOrUnselect$ = Intent.get("selectOrUnselect$");
    return {
      items$: items$,
      active$: selectOrUnselect$.merge(active$)
        .scan((active, clickedName) => {
          if (clickedName) {
            if (active.indexOf(clickedName) == -1) {
              // Select
              return active.concat([clickedName]);
            } else {
              // Unselect
              return active.filter(name => name != clickedName);
            }
          } else {
            // Keep current
            return active;
          }
        }),
    };
  });

  let View = Cycle.createView(Model => {
    let items$ = Model.get("items$");
    let active$ = Model.get("active$");
    return {
      vtree$: items$.combineLatest(active$, (items, active) => {
        let totalPrice = items
          .filter(item => active.indexOf(item.name) != -1)
          .reduce((sum, item) => (sum + item.price), 0);
        return (
          <div>
            <nav>
              {items.map(item =>
                <div attributes={{"data-name": item.name}} key={item.name}
                  class={makeClass({"item": true, active: active.indexOf(item.name) != -1})}>
                  {item.name} <b>${item.price.toFixed(2)}</b>
                </div>
              )}
              <div>
                Total: <b>${totalPrice.toFixed(2)}</b>
              </div>
            </nav>
          </div>
        );
      }),
      // TODO https://github.com/alexmingoia/jsx-transform/issues/15
    };
  });

  let Intent = Cycle.createIntent(DOM => {
    return {
      selectOrUnselect$: DOM.event$("nav .item", "click")
        .map(event => event.currentTarget.dataset.name),
    };
  });

  DOM.inject(View).inject(Model).inject(Intent, Props)[0].inject(DOM);
});