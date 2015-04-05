/**
 * 1. Everything is Rx.Observable (nearly)
 * 2. Observables can be classified into Nodes
 * 3. Common Nodes are:
 *    Model / View / Intent / Interactions (MVII)
 * 4. Dependencies are circular:
 *    Interactions <- Intent <- Model <- View <- Interactions
 * 5. CycleJS provides `inject` method to solve this
 */
// IMPORTS =========================================================================================
require("../../common/scripts/polyfills");
let {Rx, h, createStream, render} = require("cyclejs");

// INTERACTIONS ====================================================================================
let interactions$ = createStream(vtree$ => {
  return render(vtree$, "main").interactions$;
});

// [INTERACTIONS] <- INTENT ========================================================================
let changeName$ = interactions$.choose("[name=name]", "input").map(event => event.target.value);

// [INTENT] <- MODEL ===============================================================================
let name$ = changeName$.startWith("");

// [MODEL] <- VIEW =================================================================================
let vtree$ = name$.map(name => {
  return (
    <div>
      <div class="form-group">
        <label>Name:</label>
        <input name="name" class="form-control" type="text"/>
      </div>
      <hr/>
      <h1>Hello {name}!</h1>
    </div>
  );
});

// [VTREE] <- INTERACTIONS =========================================================================
interactions$.inject(vtree$);
