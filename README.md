# CycleJS examples

*Full repo reboot in progress* :turtle:

Mostly incremental examples for those who finished an [official documentation](http://cycle.js.org/getting-started.html)
or [EggHead course](https://egghead.io/lessons/rxjs-overview-of-cycle-js) and wants more.

Examples are grouped into lessons and placed in narrative order.
They are meant to be reviewed one by one, sequentially.
The best way of learning is comparison. And to compare you just diff files.

## Install

1. Download and unzip repo
2. Go to unzipped folder
3. Install static server with `$ npm install http-server -g`
4. Install packages with `$ npm install`

## Run

This repo uses single webpack config and single `node_modules` folder to simplify project management.

1. Uncomment an example line in `entry` section of `webpack.config.js`.
2. Run webpack with `$ npm run dev`
3. Run static server with `$ http-server {x.x-example-folder}`
4. See `localhost:8080`

We recommend to open `index.html` with `http://` rather than `file://` (as described above) because
many things in browser just don't work for `file://` (history, CORS, etc.).

## Table of Contents

### 1.0-form

Implement basic registration form.

### 1.1-form

Structure dataflow.

### 1.2-form

Implement actions. State loop technique (experimental).

### 1.3-form

Refactor.

### 1.4-form

From models to types.

### 1.5-form

Implement validation.

### 2.0-routing

Minimal working example. Router, pages, not-found page.

### 2.1-routing

Menu. Highlight "current" menu item.

### 2.2-routing

Refactor.

## Notes

### No trailing `$`

Convention of `obs$` was used here previously but we've changed my mind since then.

Four reasons to discard it:

1. It's inconsistent inside CycleJS. `vtree$` vs `DOM` – both are streams but named differently.<br/>
   There is a strong reason why `DOM` has no `$` (filename...) but it's still inconsistent.

2. Related projects (RxJS, Elm, etc.) does not follow this convention.

3. It turned out to be **harder to read**. Observables nested in records look especially ugly.

  Compare:

  ```js
  Observable.merge(
    intents.form.changeUsername.map(...),
    intents.form.changeEmail.map(...),
    intents.form.register.map(...)
  )

  // vs

  Observable.merge(
    intents.form.changeUsername$.map(...),
    intents.form.changeEmail$.map(...),
    intents.form.register$.map(...)
  )
  ```

4. No confusion between static and observable variables were confirmed in practice.<br/>
   Variables tend to be either first or second type in every particular (flat) namespace.

   *Simple rule: do not mix static and observable keys in records*.

   You will hit troubles using "forbid shadowing" rule (IDE or linter)
   but it's stupid anyway IMO.<br/>
   The whole idea of namespacing is to allow repeating names. In other words they are *inevitable*.

So for now we're sticking with "repeat names" rule:

```js
Observable.combineLatest(
  foo, bar,        // observable vars
  (foo, bar) => {  // static vars
    ...
  }
)
```

### Styleguides

[FAQ](https://github.com/Paqmind/styleguides)
