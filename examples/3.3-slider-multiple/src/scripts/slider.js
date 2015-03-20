// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("Slider", (User, Props) => {
  let Model = Cycle.createModel((Intent, Props) => ({
    id$: Props.get("id$").shareReplay(1),

    value$: Props.get("value$").startWith(0)
      .merge(Intent.get("changeValue$")),
  }));

  let View = Cycle.createView(Model => {
    let id$ = Model.get("id$");
    let value$ = Model.get("value$");
    return {
      vtree$: value$.combineLatest(id$, (value, id) => (
        <fieldset class="slider">
          <legend>Slider <small>{id}</small></legend>
          <div class="form-group">
            <label>Amount</label>
            <div class="input-group">
              <input type="range" value={value} min="0" max="100"/>
              <div class="input-group-addon">
                <input type="text" value={value} readonly="1"/>
              </div>
            </div>
          </div>
          <div>
            <button class="btn btn-default remove">Remove</button>
          </div>
        </fieldset>
      )),
    };
  });

  let Intent = Cycle.createIntent(User => {
    return {
      changeValue$: User.event$("[type=range]", "input")
        .map(event => parseInt(event.target.value)),

      remove$: User.event$(".btn.remove", "click")
        .map(event => true),
    };
  });

  User.inject(View).inject(Model).inject(Intent, Props)[0].inject(User);

  return {
    changeValue$: Intent.get("changeValue$")
      .combineLatest(Model.get("id$"), (value, id) => ({id, value})),

    remove$: Intent.get("remove$")
      .combineLatest(Model.get("id$"), (_, id) => id)
      .tap((id) => {
        console.log(`Component sends remove(${id})`);
      }),
  };
});
