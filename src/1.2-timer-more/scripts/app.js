// IMPORTS =========================================================================================
let makeClass = require("classnames");
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// APP =============================================================================================
let Model = Cycle.createModel(Intent => {
  let started = Date.now();
  let tickToTimeDelta = function() {
    return Date.now() - started
  };
  let control$ = Intent.get("control$").startWith(true);
  let stop$ = Intent.get("stop$");
  return {
    msSinceStart$: Rx.Observable.interval(100)
      .map(tickToTimeDelta)
      .pausable(control$)
      .takeUntil(stop$),

    stopped$: stop$.startWith(false),
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

let Intent = Cycle.createIntent(DOM => {
  return {
    control$: Rx.Observable.merge(
      DOM.event$(".btn.pause", "click").map(() => false),
      DOM.event$(".btn.continue", "click").map(() => true)
    ),
    stop$: DOM.event$(".btn.stop", "click"),
  }
});

let DOM = Cycle.createDOMUser("main");

DOM.inject(View).inject(Model).inject(Intent).inject(DOM);