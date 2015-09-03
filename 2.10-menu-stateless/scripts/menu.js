import HH from "hyperscript-helpers";
import Class from "classnames";
import Cycle, {Rx} from "@cycle/core";
import {h} from "@cycle/dom";

let {div, nav, p, b} = HH(h);
let {Observable} = Rx;

// COMPONENTS ======================================================================================
export default function Menu({DOM, props}) {
  return {
    DOM: Observable.combineLatest(
      props.get("items"), props.get("active"),
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
    }),

    events: {
      active: DOM.select("nav .item").events("click")
        .map(event => event.currentTarget.dataset.name)
    }
  };
}
