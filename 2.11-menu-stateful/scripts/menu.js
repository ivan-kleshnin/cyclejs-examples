import HH from "hyperscript-helpers";
import Class from "classnames";
import Cycle, {Rx} from "@cycle/core";
import {h} from "@cycle/dom";

let {div, nav, p, b} = HH(h);
let {Observable} = Rx;

// COMPONENTS ======================================================================================
export default function Menu({DOM, props}) {
  function intent(DOM) {
    return {
      selectActive$: DOM.get("nav .item", "click")
        .map(event => event.currentTarget.dataset.name),
    };
  }

  function model(actions, props) {
    return {
      items$: props.get("items")
        .startWith([])
        .shareReplay(1),

      active$: props.get("active")
        .startWith(undefined)
        .merge(actions.selectActive$)
        .shareReplay(1),
    };
  }

  function view(state) {
    return {
      DOM: Observable.combineLatest(
        state.items$, state.active$,
        function (items, active) {
          return div({className: "menu"}, [
            nav(
              items.map(item => div(
                {attributes: {"data-name": item}, key: item, className: Class("item", {active: item == active})},
                item
              ))
            ),
            p(["Selected: ", b(active)])
          ]);
        }
      ),
    };
  }

  let actions = intent(DOM);
  let state = model(actions, props);
  let presentation = view(state);

  return {
    DOM: presentation.DOM,
    events: {
      active: state.active$
    }
  };
}
