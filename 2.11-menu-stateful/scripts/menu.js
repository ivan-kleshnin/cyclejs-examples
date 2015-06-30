import Cycle from "cyclejs";
import Class from "classnames";
let {Rx} = Cycle;
let Observable = Rx.Observable;

// COMPONENTS ======================================================================================
export default function Menu(interactions, props) {
  function Intent(interactions) {
    return {
      selectActive$: interactions.get("nav .item", "click")
        .map(event => event.currentTarget.dataset.name),
    };
  }

  function Model(intentions, props) {
    return {
      items$: props.get("items")
        .startWith([])
        .shareReplay(1),

      active$: props.get("active")
        .startWith(undefined)
        .merge(intentions.selectActive$)
        .shareReplay(1),
    };
  }

  function View(state) {
    return Observable.combineLatest(
      state.items$, state.active$,
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
    });
  }

  let intentions = Intent(interactions);
  let state = Model(intentions, props);
  let vtree$ = View(state);
  let active$ = state.active$;

  return {vtree$, active$};
}
