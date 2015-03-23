// IMPORTS =========================================================================================
require("./shims");
let makeClass = require("classnames");
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// APP =============================================================================================
let Model = Cycle.createModel(Intent => {
  let started = Date.now();
  let control$ = Rx.Observable.merge(
    Intent.get("continue$"),
    Intent.get("pause$").map(() => false)
  );
  return {
    msSinceStart$: Rx.Observable.interval(100)
      .map(() => Date.now() - started)
      .pausable(control$.startWith(true))
      .takeUntil(Intent.get("stop$")),

    stopped$: Intent.get("stop$").startWith(false),
  };
});

let View = Cycle.createView(Model => {
  return {
    vtree$: Rx.Observable.combineLatest(
      Model.get("msSinceStart$"), Model.get("stopped$"),
      function(msSinceStart, stopped) {
        let timeDelta = (msSinceStart / 1000).toFixed(1);
        return (
          <div>
            <p class={makeClass({muted: stopped})}>
              Started {timeDelta} seconds ago {stopped ? "(Timer stopped)" : ""}
            </p>
            <div class="btn-group">
              <button class="btn btn-default pause" disabled={stopped}>Pause</button>
              <button class="btn btn-default continue" disabled={stopped}>Continue</button>
              <button class="btn btn-default stop" disabled={stopped}>Stop</button>
            </div>
          </div>
        );
      }
    ),
  };
});

let Intent = Cycle.createIntent(User => {
  return {
    pause$: User.event$(".btn.pause", "click").map(() => true),
    continue$: User.event$(".btn.continue", "click").map(() => true),
    stop$: User.event$(".btn.stop", "click").map(() => true),
  }
});

let User = Cycle.createDOMUser("main");

User.inject(View).inject(Model).inject(Intent).inject(User);