// IMPORTS =========================================================================================
import {assoc} from "ramda";
import Class from "classnames";
import Cycle from "cyclejs";
let {Rx} = Cycle;
let {Observable, Subject} = Rx;

// CONSTANTS =======================================================================================
const TICK_MS = 500;
const MINUTE_MS = 60000;

// APP =============================================================================================
function Intent(interactions) {
  return {
    // TODO: debounce without delay
    trigger$: interactions.get(".btn.trigger", "click").map(true)
  }
}

function Model(intentions) {
  function seedState() {
    return {
      watch: 0,            // state: 0 = stopped, 1 = running, 2 = paused
      value: 0,            // timer value in milliseconds
      valueBeforeReset: 0, // prev timer value, required for animation
    };
  }

  let trigger$ = intentions.trigger$.map(() => {
    return function (state) {
      if (state.watch == 2) {
        state = assoc("valueBeforeReset", state.value, state);
        state = assoc("value", 0, state);
      }
      state = assoc("watch", (state.watch + 1) % 3, state);
      return state;
    }
  });

  let tick$ = Observable.interval(TICK_MS)
    .map(() => {
      return function (state) {
        if (state.watch == 1) {
          if (state.value < MINUTE_MS - TICK_MS) {
            state = assoc("value", state.value + TICK_MS, state);
          } else {
            state = assoc("value", 0, state);
          }
        }
        if (state.value == 0) {
          state = assoc("watch", 0, state);
        }
        return state;
      }
    });

  let transform$ = Rx.Observable.merge(
    trigger$, tick$
  );

  return {
    state$: transform$
      .scan(seedState(), (state, transform) => transform(state))
      .distinctUntilChanged()
      .shareReplay(1)
  };
}

function View(state) {
  function mSecToSec(value) {
    return (value / 1000).toFixed(1)
  }

  function secondToAngle(second) {
    return (second % 60) * 6;
  }

  return state.state$.map(state => {
      let secondBeforeReset = mSecToSec(state.valueBeforeReset);
      let second = mSecToSec(state.value);
      let angle = secondToAngle(second);
      let stopped = state.watch == 0;
      return (
        <div>
          <div className="stopWatch frame">
            <div className={Class("stopWatch", "arrow")} style={{
              "transform": `rotate(${angle}deg)`,
              "transform-origin": "bottom",
              "transition-property": "transform",
              "transition-timing-function": stopped ? "ease-out" : "cubic-bezier(.4, 2, .55, .44)",
              "transition-duration": stopped ? `${secondBeforeReset / 30}s` : `${TICK_MS / 1000}s`,
            }}>
              {second}
            </div>
          </div>
          <div className="stopWatch trigger">
            <button className="btn btn-default trigger">Trigger</button>
          </div>
        </div>
      );
    }
  );
}

Cycle.applyToDOM("#main", interactions => View(Model(Intent(interactions))));
