# Lesson 10: Isomorphic App

Isomoprhic apps are from the main selling points of fullstack JS. Be sure, they are not a piece of cake
to implement but the result is worth it. To present such app we need to bootstrap backend, frontend
and frontend router code.

To make an app isomorphic from the frontend perspective we need to wrap it in a middleware

```js
function makeIsomorphic(appFn) {
  return function (responses) {
    let requests = appFn(responses);
    requests.DOM = requests.DOM.skip(1);
    return requests;
  };
}
```

which does only one thing: skips first rendering result because it's already in the real DOM.

From the backend perspective, a frontend app should just render the whole HTML (as a string)
because DOM is meaningless to server (in general case).

```js
function makeIsomorphic(appFn, appCode$, globals$) {
  return function (responses) {
    let appVtree$ = appFn(responses).DOM;
    return {
      DOM: Observable.combineLatest(appVtree$, appCode$, globals$, renderHtml)
    };
  };
}

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
```

The main moving parts here are: app code, app HTML, resulting HTML and the global vars.

Currently, there is no decent Webpack integration so backend must be reloaded every time new bundle is generated.
