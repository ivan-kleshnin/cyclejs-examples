import Cycle from "cyclejs";
import Class from "classnames";
let {Rx} = Cycle;
let Observable = Rx.Observable;

// COMPONENTS ======================================================================================
export default function Menu(interactions, props) {
  return {
    vtree$: Observable.combineLatest(
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

    active$: interactions.get("nav .item", "click")
      .map(event => event.currentTarget.dataset.name),
  };
}
