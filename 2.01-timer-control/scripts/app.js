import Class from "classnames";
import Cycle from "cyclejs";
let {Rx} = Cycle;
let Observable = Rx.Observable;

// APP =============================================================================================
function intent(interactions) {
  return {
    pause$: interactions.get(".btn.pause", "click").map(() => true),
    resume$: interactions.get(".btn.resume", "click").map(() => true),
    stop$: interactions.get(".btn.stop", "click").map(() => true),
  };
}

function model(actions) {
  let started = Date.now();

  let run$ = Observable.merge(
    actions.resume$,
    actions.pause$.map(() => false)
  ).distinctUntilChanged();

  let stop$ = actions.stop$;

  return {
    msSinceStart$: Observable.interval(100)
      .pausable(run$.startWith(true))
      .map(() => Date.now() - started)
      .takeUntil(stop$),

    stopped$: stop$.startWith(false),
  };
}

function view(state) {
  return Observable.combineLatest(
    state.msSinceStart$, state.stopped$,
    function (msSinceStart, stopped) {
      let timeDelta = (msSinceStart / 1000).toFixed(1);
      return (
        <div>
          <p className={Class({muted: stopped})}>
            Started {timeDelta} seconds ago {stopped ? "(Timer stopped)" : ""}
          </p>
          <div className="btn-group">
            <button className="btn btn-default pause" disabled={stopped}>Pause</button>
            <button className="btn btn-default resume" disabled={stopped}>Resume</button>
            <button className="btn btn-default stop" disabled={stopped}>Stop</button>
          </div>
        </div>
      );
    }
  );
}

Cycle.applyToDOM("#app", interactions => view(model(intent(interactions))));
