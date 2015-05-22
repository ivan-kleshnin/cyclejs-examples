# Lesson 1: Gentle Introduction

Be sure you have read at least [CycleJS README](https://github.com/staltz/cycle).

## 1.0: Hello Cycle

Your whole app contains only one imperative call `Cycle.applyToDOM`. Everything else is declarative.

Data flow is expressed in terms of RxJS operators and their combinations.

Notice that
```js
Cycle.applyToDOM("#main", Computer);
```
is
```js
Cycle.applyToDOM("#main", interactions => Computer(interactions));
```

So in the simplest case your app is the single function `Computer` which
translates `User` interactions to Virtual DOM Observable.

## 1.1: Hello Component

Component has the same structure as the App. In functional programming done right
the common answer to *"What is [something]?"* is *"A function..."*.
CycleJS is no exception ;)

The same structure means your app can be put into Web Component and released as library.

You must pass unique (among siblings) key arguments into custom components.

This is different from, say, React, because Virtual DOM used by CycleJS has a different approach
to VDOM <-> DOM conversions.

Also be sure to check the requirements for WebComponent names:
https://github.com/staltz/cycle/issues/126

This may be changed later, as WC is a draft, not a spec.

## 1.2: Hello Nodes

We want to group observables by aspect or behavior.
We can express data flow in terms of nodes. Notice that structure stays the same,
just more function calls are added to the sequence:

Before
```js
Cycle.applyToDOM("#main", interactions => Computer(interactions));
```

After
```js
Cycle.applyToDOM("#main", interactions => View(Model(Intent(Computer(interactions)))));
```

The number and meaning of nodes is up to you. You can skip the `Intent`, for example, or add more nodes to the sequence.
The structure won't change. Nodes may accept more than one argument. For example, `Model` can
be derived from `intentions` and `source` (some initial data).
CycleJS does not establish any hardcoded conventions here. Just be sure you combine
your circular dependency in the right order. The last node in the sequence should return VDOM.

To reiterate:

#### Simplest data-flow scheme
```
Computer: interactions <- VDOM
User: VDOM <- interactions (this part is implicit)
```

#### Advanced data-flow scheme
```
Intent: interactions <- intentions
Model: intentions <- models
View: models <- VDOM
User: VDOM <- interactions (this part is implicit)
```

And don't forget the lesson from \1.1. Everything is fractal: the same or different
data-flow can be incapsulated in any component.
