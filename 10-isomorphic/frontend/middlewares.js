import {renderHtml} from "../frontend/renders";

// MIDDLEWARES MAKERS ==============================================================================
function makeIsomorphic(appFn) {
  return function (responses) {
    let requests = appFn(responses);
    requests.DOM = requests.DOM.skip(1);
    return requests;
  };
}

export {
  makeIsomorphic,
};
