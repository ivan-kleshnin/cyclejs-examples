# CycleJS examples

Subjective followup to an [official repo](https://github.com/cyclejs/examples).

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

We recommend to open `index.html` with `http://` (i.e. serve it as described above) because
many things in browser simply don't work for `file://` (history, CORS, etc.).

## Table of Contents

### 1.0-form

Basic registration form.

### 1.1-form

State. Dataflow.

### 1.2-form

Actions. State loop.

### 1.3-form

Refactoring. Lenses.

### 1.4-form

From models to types (implicit validation).

### 1.5-form

Implement (explicit) validation.

### 2.0-routing

Minimal working example. Router, pages, menu, not-found.

### 2.1-routing

Refactoring. Highlight "current" menu item.

### 2.2-routing

Use [route-parser](https://github.com/rcs/route-parser) library.<br/>
Models and URL params.

### 3.0-crud

Basic CRUD + Index example. Types, forms, validation, navigation, and state management at once.

### 20.0-memory-game

[See here](https://github.com/ivan-kleshnin/memory-game)

### 20.1-tetris-game

[See here](https://github.com/ivan-kleshnin/tetris-game)

## Notes

### No trailing `$`

Convention of `obs$` was used here previously but we've changed my mind since then.

Five reasons to discard it:

1. It's inconsistent inside CycleJS. `vtree$` vs `DOM` – both are streams but named differently.<br/>
   There is a strong reason why `DOM` has no `$` (filename...) but it's still inconsistent.

2. Related projects (RxJS, Elm, etc.) does not follow this convention.

3. It turns out to be **harder to read**. Nested streams look especially ugly:

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

4. It fails to represent all the cases:

   ```
   user - single model      :: User
   users - array of models  :: [User]
   user$ - model stream     :: Observable User
   users$ - array stream    :: Observable [User]
   ```

   So far so good. Even

   ```
   user$s - array of model streams  :: [Observable User]
   users$s - array of array streams :: [Observable [User]]
   ```

   kinda work. Until you hit a special word:

   ```
   ...
   peopl$e ? @_@
   ```

   What about records of streams? Clear enough, I hope.

5. No confusion between static and observable variables were confirmed in practice.<br/>
   Variables tend to be either first or second type in every particular (flat) namespace.

   *Simple rule: do not mix static and observable keys in records*.

   Caution: you may hit troubles with "forbid shadowing" rule in IDE or linter.

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
