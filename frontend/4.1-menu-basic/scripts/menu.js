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
        .merge(Intent.get("selectActive$"))
        .startWith([]),
    }
  });

  let View = Cycle.createView(Model => {
    let items$ = Model.get("items$");
    let active$ = Model.get("active$");
    return {
      vtree$: items$.combineLatest(active$, (items, active) => {
        return (
          <div>
            <nav>
              {items.map(item =>
                <div attributes={{"data-name": item}} key={item}
                  class={makeClass({"item": true, active: item == active})}>
                  {item}
                </div>
              )}
            </nav>
            <p>
              Selected: <b>{active}</b>
            </p>
          </div>
        );
      }),
      // TODO https://github.com/alexmingoia/jsx-transform/issues/15
    };
  });

  let Intent = Cycle.createIntent(User => {
    return {
      selectActive$: User.event$("nav .item", "click")
        .map(event => event.currentTarget.dataset.name),
    };
  });

  User.inject(View).inject(Model).inject(Intent, Props)[0].inject(User);
});
