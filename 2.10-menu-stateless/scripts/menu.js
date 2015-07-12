import Cycle from "@cycle/core";
import Class from "classnames";

let {Rx} = Cycle;
let Observable = Rx.Observable;

// COMPONENTS ======================================================================================
export default function Menu({DOM, props}) {
  return {
    DOM: Observable.combineLatest(
      props.get("items"), props.get("active"),
      function (items, active) {
      return (
        <div className="menu">
          <nav>
            {items.map(item =>
              <div attributes={{"data-name": item}} key={item}
                className={Class("item", {active: item == active})}>
                {item}
              </div>
            )}
          </nav>
          <p>
            Selected: <b>{active}</b>
          </p>
        </div>
      );
    }),

    events: {
      active: DOM.get("nav .item", "click")
        .map(event => event.currentTarget.dataset.name)
    }
  };
}
