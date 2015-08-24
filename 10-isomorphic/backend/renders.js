import serialize from "serialize-javascript";
import HH from "hyperscript-helpers";
import {h} from "@cycle/dom";

let {body, div, head, html, script, title} = HH(h);

// RENDERS =========================================================================================
function renderHtml(appVtree, appCode, globals) {
  return html([
    head(
      title("Cycle Isomorphism Example")
    ),
    body([
      div({id: "app"}, appVtree),
      script(`window.globals = ${JSON.stringify(globals)};`),
      script(appCode)
    ])
  ]);
}

export {
  renderHtml,
};
