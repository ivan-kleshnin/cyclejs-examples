# Lesson 1: Gentle Introduction

Make sure you've read through [official documentation](http://cycle.js.org/getting-started.html) at least once.

## 1.0: Hello Cycle

http://cycle.js.org/basic-examples.html

The whole app contains only one imperative call `Cycle.run`. Everything else is declarative.
And no sign of `this` keyword. How cool is that?!

Data flow is expressed in terms of RxJS operators and their combinations.

Notice that

```js
Cycle.run(main, drivers)
```

is the same thing as

```js
Cycle.run(responses => main(responses), drivers);
```

In this simplest case our app is the single `main` function which relies on the single `DOM` driver.

So we have the famous cycle:

```js
requests = computer(responses)
responses = user(requests)
responses <= user(computer(responses)) -- mathematical function
```

The `computer` function is named `main` and our single `DOM` drivers serves as a proxy for
 "user" function. `requests` and `responses` are just namespaces for different drivers.

If we try to type our system we'll get something like:

```js
Responses: {*: Observable}
Requests: {*: Observable}
main: Responses -> Requests
```

### Experiment

Use `Observable.:tap()` method like

```js
observable$
  .*
  .tap(x => {
    console.log(x);
  })
```

if you want to spy on already used `Observable`.

or `Observable::subscribe()` like:

```js
observable$
  .subscribe(x => {
    console.log(x);
  })
```

if you want to spy on otherwise unused `Observable`.

Remember that `.tap()` returns `Observable` and `.subscribe()` returns `Disposable`.
Don't try to chain anything after `.subscribe()`.

Also beware that every `subscribe` creates new subscription unless you're subscribing to a hot `Observable`.
This may influence some examples.

### Practice

1. Reimplement this form with an additional **address** textarea field.
2. Rimplement this form with a single **name** field. Hint: use an `Observable::map`

## 1.1: Hello Nodes

http://cycle.js.org/model-view-intent.html

We want to split data flow into several steps representing specific aspects of data transformations.
We can express this steps in terms of nodes.

```js
Requests: {*: Observable}
Responses: {*: Observable}
Actions: {*: Observable}
State: {*: Observable}

intent: Responses -> Actions
model: Actions -> State
view: State -> Requests
```

Not a single breaking change here, just more steps in the pipeline:

```js
// Previous scheme
Cycle.run(main, ...);

// Current scheme
Cycle.run(responses => view(model(intent(responses))), ...);
```

The number and meaning of nodes is up to you. You can skip the `intent`, for example, or add more nodes to the sequence.
The structure won't change. Also nodes may accept more than one argument. For example, `model` can
be derived from `actions` and `source` (some initial data).

No rigid requirements here, CycleJS just provides some clues for your reasoning.
Just remember that the first node should always accept `responses` and
the last node should always return `requests` according to the [Dialogue Abstraction](http://cycle.js.org/dialogue.html)

## 1.2: Hello Component

http://cycle.js.org/custom-elements.html

Component has the same structure as the App. "Everything is a function" &copy;

The same structure means your app can be put into Web Component and released as library.

You must pass unique (among siblings) key arguments into custom components.

This is different from, say, React, because Virtual DOM used by CycleJS has a different approach
to VDOM <-> DOM conversions.

Also be sure to check the requirements for WebComponent names:
https://github.com/staltz/cycle/issues/126

This may be changed later, as WC is a draft, not a spec.

## 1.3: Hello Apps

Just a basic example to demonstrate multiple apps working in the same page.
