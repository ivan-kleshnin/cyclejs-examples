import serialize from "serialize-javascript";
import HH from "hyperscript-helpers";
import {h} from "@cycle/dom";

let {a, div, li, h1, html, p, ul, section} = HH(h);

// RENDERS =========================================================================================
function renderMenu() {
  return ul({className: "home"}, [
    li(a({className: "link", href: "/"}, "Home")),
    li(a({className: "link", href: "/about"}, "About")),
  ]);
}

function renderHomePage() {
  return section({className: "home"}, [
    h1("The homepage"),
    p("Welcome to our spectacular web page with literally nothing special here."),
    p("Contact us"),
    renderMenu(),
  ]);
}

function renderAboutPage() {
  return section({className: "about"}, [
    h1("React more about us"),
    p("this is the page where we describe ourselves."),
    p("Contact us"),
    renderMenu(),
  ]);
}

function renderUnknownPage(route) {
  return div(`Unknown page ${route}`);
}

export {
  renderMenu, renderHomePage, renderAboutPage, renderUnknownPage,
};
