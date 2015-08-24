import {Rx} from "@cycle/core";
import {renderHtml} from "./renders";

let {Observable} = Rx;

// MIDDLEWARE MAKERS ===============================================================================
function makeIsomorphic(appFn, appCode$, globals$) {
  return function (responses) {
    let appVtree$ = appFn(responses).DOM;
    return {
      DOM: Observable.combineLatest(appVtree$, appCode$, globals$, renderHtml)
    };
  };
}

export {
  makeIsomorphic,
};

