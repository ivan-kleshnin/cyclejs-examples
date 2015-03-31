// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;
let makeClass = require("classnames");

// COMPONENTS ======================================================================================
Cycle.registerCustomElement("Menu", (User, Props) => {
  let Model = Cycle.createModel((Intent, Props) => {
    return {
      items$: Props.get("items$").startWith([]),
      active$: Props.get("active$")
        .merge(Intent.get("selectOrUnselect$").map(name => [name]))
        .startWith([])
        .scan((state, names) => {
          return names.reduce((state, name) => {
            if (name) {
              if (state.indexOf(name) == -1) {
                // Select
                return state.concat([name]);
              } else {
                // Unselect
                return state.filter(n => n != name);
              }
            } else {
              // Keep current
              return state;
            }
          }, state);
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

  let Intent = Cycle.createIntent(User => {
    return {
      selectOrUnselect$: User.event$("nav .item", "click")
        .map(event => event.currentTarget.dataset.name),
    };
  });

  User.inject(View).inject(Model).inject(Intent, Props)[0].inject(User);
});