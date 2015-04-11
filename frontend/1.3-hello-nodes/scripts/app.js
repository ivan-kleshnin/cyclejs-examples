// IMPORTS =========================================================================================
require("../../common/scripts/polyfills");
let {Rx, h, createStream, render} = require("cyclejs");

// DATA-SOURCE =====================================================================================
let input$ = Rx.Observable.fromPromise(
  new Promise((resolve, reject) => {
    resolve("CycleJS");
  })
);

// INTERACTION =====================================================================================
let interaction$ = createStream(vtree$ => {
  return render(vtree$, "main").interaction$;
});

// [INTERACTION] <- INTENT =========================================================================
let changeName$ = createStream(interaction$ => {
  return interaction$.choose("[name=name]", "input").map(event => event.target.value);
});

// [INTENT] <- MODEL ===============================================================================
let name$ = createStream((changeName$, input$) => {
  return input$.merge(changeName$).startWith("");
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

// DATA-SINK =======================================================================================
name$.subscribe(name => {
  console.log(name);
});

// CYCLE ===========================================================================================
interaction$.inject(vtree$);
vtree$.inject(name$);
name$.inject(changeName$, input$);
changeName$.inject(interaction$);
