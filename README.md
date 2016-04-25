# CycleJS examples

Subjective followup to the [official repo](https://github.com/cyclejs/examples).

Examples are grouped into lessons and placed in narrative order.<br/>
They are meant to be reviewed one by one, sequentially.<br/>
The best way of learning is comparison. And to compare you just diff files.<br/>

## Install

1. Download and unzip repo
2. Go to unzipped folder
3. Install packages with `$ npm install`

## Run

1. Run dev server with `$ npm run {example-number}` (only number, no suffix)
2. See `localhost:8080`

We recommend to open `index.html` with `http://` (i.e. serve it as described above) because
many things in browser simply don't work for `file://` (history, CORS, etc.).

## Table of Contents

### 1.0-form

Basic registration form.

### 1.1-form

State. Dataflow.

### 1.2-form

Actions. Update loop.

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

### 2.3-routing

Implement link-based nested menus.

### 3.0-crud

Basic CRUD + Index example. Types, forms, validation, navigation, and state management at once.

### 20.0-memory-game

[See here](https://github.com/ivan-kleshnin/memory-game)

### 20.1-tetris-game

[See here](https://github.com/ivan-kleshnin/tetris-game)

## Notes

### Glitches

Diamond cases in stream topologies will cause unnecessary events called "glitches".
RxJS does not apply topological sorting to suppress them (as Bacon or Flyd do).
Performance and memory usage are gradually improved but not without consequences.

Imagine you have `state` and `derivedState` streams.
DOM depends from both `state` and `derivedState`.

```js
let derivedState = state.map(...)
let DOM = Observable.combineLatest(state, derivedState, (state, derivedState) => /* render DOM */)
```

Now every time a change in `state` will cause a change in `derivedState` you'll have two DOM rendering instead of one.

There are basically three ways to address this:

1) Use `.withLatestFrom()` and / or `.zip()` to express your dataflow as a set of control and data streams.
May be surprisingly hard to implement and support.

2) Debounce glitches. Derived states are mostly sync calculations so `debounce(1)` will work like a charm.

```js
DOM: Observable.combineLatest(...whatever).debounce(1).map(([...]) => /* render DOM */)
```

3) Tolerate glitches. May be a good choice while you're not confident about dataflow.
As long as side effects are relative painless (DOM diffs are) – it's only a performance issue, man.

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

and we use `$` as a shortcut for statics in `Observable` (`let {Observable: $} = require("rx")`).

### Console driver

Is not a joke. It's really required in rare cases. If you try

```js
function page1(src) {
  ...
  intents.foo.subscribe((...) => {
    console.log(...)
  })
  ...
}

function page2(src) {
  ...
  intents.foo.subscribe((...) => {
    console.log(...)
  })
  ...
}
```

you may get an impression that "architecture is broken": page events are repeating, interleaving, etc.

Which is wrong. Multipage architecture works because of `flatMapLatest` which
disposes subscriptions no longer required. Subscription style shown above is unmanageable and leads
to memory leaks.

You should use `tap` instead of `subscribe`:

```js
function page1(src) {
  ...
  intents.foo.tap((...) => {
    console.log(...)
  })
  ...
}

function page2(src) {
  ...
  intents.foo.tap((...) => {
    console.log(...)
  })
  ...
}
```

or you can utilize console driver:

```js
function page1(src) {
  ...
  return {
    console: intents.foo.map(...) // convert intent value to string
    DOM: ...
  }
}

function page2(src) {
  ...
  return {
    console: intents.foo.map(...) // convert intent value to string
    DOM: ...
  }
}
```

### Styleguides

[FAQ](https://github.com/Paqmind/styleguides)
