import Cycle from "@cycle/core";
import CycleDOM from "@cycle/dom";
import {renderHomePage, renderAboutPage, renderUnknownPage} from "./renders";

let {Rx} = Cycle;
let {Observable} = Rx;

// APP =============================================================================================
function app(responses) {
  let routeFromClick$ = responses.DOM.get(".link", "click")
    .doOnNext(event => event.preventDefault())
    .map(event => event.currentTarget.attributes.href.value);

  let ongoingContext$ = responses.globals
    .merge(routeFromClick$).scan((acc, x) => {
      acc.route = x;
      return acc;
    });

  let vtree$ = ongoingContext$
    .map(({route}) => {
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", route);
      }
      switch (route) {
        case "/":      return renderHomePage();
        case "/about": return renderAboutPage();
        default:       return renderUnknownPage(route);
      }
    });

  return {
    DOM: vtree$
  };
}

export default app;
