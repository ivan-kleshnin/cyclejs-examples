/**
 * 1. Everything is Rx.Observable (nearly)
 * 2. Observables can be classified into Nodes
 * 3. Common Nodes are:
 *    Model / View / Intent / Interactions (MVII)
 * 4. Dependencies are circular:
 *    Interactions <- Intent <- Model <- View <- Interactions
 * 5. CycleJS provides `inject` method to solve this
 * 6. Eager Observable input is impossible to mock for tests
 * 7. So it"s conventional to wrap every Node in `createStream`
 * 8. It will also make easier to add / remove Nodes later
 * 9. MVII is just a convenient preset, not a requirement
 */
// IMPORTS =========================================================================================
require("../../common/scripts/polyfills");
let {Rx, h, createStream, render} = require("cyclejs");

// INTERACTIONS ====================================================================================
let interactions$ = createStream(vtree$ => {
  return render(vtree$, "main").interactions$;
});

// [INTERACTIONS] <- INTENT ========================================================================
let changeName$ = createStream(interactions$ => {
  return interactions$.choose("[name=name]", "input").map(event => event.target.value);
});

// [INTENT] <- MODEL ===============================================================================
let name$ = createStream(changeName$ => {
  return changeName$.startWith("");
});

// [MODEL] <- VIEW =================================================================================
let vtree$ = createStream(name$ => {
  return name$.map(name => {
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
});

// CYCLE ===========================================================================================
interactions$.inject(vtree$).inject(name$).inject(changeName$).inject(interactions$);
