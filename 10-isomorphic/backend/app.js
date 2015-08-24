import Cycle from "@cycle/core";
import {makeHTMLDriver} from "@cycle/dom";
import {makeIsomorphic} from "./middlewares";
import {clientBundle$} from "./resources";
import frontendApp from "../frontend/app";

let {Rx} = Cycle;
let {Observable} = Rx;

// APP =============================================================================================
export default function app(req, res) {
  // Handle favicon requests
  if (req.url === "/favicon.ico") {
    res.writeHead(200, {"Content-Type": "image/x-icon"});
    res.end();
    return;
  }

  // Handle other requests
  let globals$ = Observable.return({route: req.url});
  let [requests, responses] = Cycle.run(makeIsomorphic(frontendApp, clientBundle$, globals$), {
    DOM: makeHTMLDriver(),
    globals: () => globals$
  });
  let html$ = responses.DOM.get(":root").take(1);
  html$.subscribe(html => {
    res.send("<!doctype html>" + html); // TODO: Downscale to response.write to prevent huge string concatenation?!
  });
}
