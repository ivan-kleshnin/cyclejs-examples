// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// ELEMENTS ========================================================================================
Cycle.registerCustomElement("Slider", (User, Props) => {
  let Model = Cycle.createModel((Intent, Props) => ({
    id$: Props.get("id$"),
    value$: Props.get("value$").startWith(0)
      .merge(Intent.get("changeValue$")),
  }));

  let View = Cycle.createView(Model => {
    let id$ = Model.get("id$");
    let value$ = Model.get("value$");
    return {
      vtree$: value$.combineLatest(id$, (value, id) => (
        <div class="form-group">
          <label>Amount</label>
          <div class="input-group">
            <input type="range" value={value} placeholder="Amount"/>
            <div class="input-group-addon">
              <input type="text" value={value} readonly="1"/>
            </div>
          </div>
        </div>
      )),
    };
  });

  let Intent = Cycle.createIntent(User => {
    return {
      changeValue$: User.event$("[type=range]", "input")
        .map(event => parseInt(event.target.value)),
    };
  });

  User.inject(View).inject(Model).inject(Intent, Props)[0].inject(User);

  return {
    changeValue$: Intent.get("changeValue$")
      .combineLatest(Model.get("id$"), (value, id) => ({id, value})),
  };
});
