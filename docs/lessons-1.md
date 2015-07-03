# Lesson 1: Gentle Introduction

Be sure you have read at least [CycleJS README](https://github.com/staltz/cycle).

## 1.0: Hello Cycle

Every file which uses JSX syntax must import `h` variable from `@cycle/web`.

```js
import {h} from "@cycle/web";
```

The `jsx-webpack?ignoreDocblock&jsx=h` line in `webpack.config-*.js` corresponds to that.

Here and below we will capitalize data-flow functions (like `Model`, `View`, `Intent`, `Main`...)
for better visual separation. Data-flow functions are object creators and we're not going to fall back to
 OOP anymore so why not withdraw this privilege from them.

The whole app contains only one imperative call `Cycle.run`. Everything else is declarative.

Data flow is expressed in terms of RxJS operators and their combinations.

Notice that

```js
Cycle.run(Main, drivers)
```

is the same thing as

```js
Cycle.run(responses => Main(responses), drivers);
```

In this simplest case our app is the single function `Main` which relies on the single `DOM` driver.

```js
Responses: {*: Observable}
Requests: {*: Observable}
Main: Responses -> Requests
```

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
Cycle.applyToDOM("#app", interactions => Computer(interactions));
```

After

```js
Cycle.applyToDOM("#app", interactions => View(Model(Intent(Computer(interactions)))));
```

The number and meaning of nodes is up to you. You can skip the `Intent`, for example, or add more nodes to the sequence.
The structure won't change. Nodes may accept more than one argument. For example, `Model` can
be derived from `intentions` and `source` (some initial data).
CycleJS does not establish any hardcoded conventions here. Just be sure you combine
your circular dependency in the right order. The last node in the sequence should return VDOM.

#### Simplest data-flow scheme

```
Computer: interactions <- VDOM
User: VDOM <- interactions (this part is implicit)
```

#### Advanced data-flow scheme

```
Intent: interactions <- intentions
Model: intentions <- state
View: state <- VDOM
User: VDOM <- interactions (this part is implicit)
```

And don't forget the conclusion from \1.1. Everything is fractal: the same or different
data-flow can be incapsulated in any component.

## 1.3: Final

If you was attentive you might notice one difference between `App` and `Component` code.
Let's reiterate.

For now we saw two ways to setup an app:
```js
// 1)
Cycle.applyToDOM("#app", interactions => Computer(interactions));
// 2)
Cycle.applyToDOM("#app", interactions => View(Model(Intent(interactions))));
```

So it's `interactions -> VDOM` for setup 1)
and `pipe (interactions -> intentions) (intentions -> state) (state -> VDOM)` for setup 2),
where `pipe` is a left-to-right function composer.

But `Footer` function from [**Hello Component**](#11-hello-components) looked different:

```js
function Footer(interactions, props) {
  return {
    vtree$: Observable...
  };
}
```

So it's `interactions -> props -> {vtree$: Observable}`?!

Don't wory: that's actually the same thing.

Both app and component functions accept an interactions and an optional container of props.

Both app and component may return `vtree$` directly or an object with `vtree$` key
in case the other keys describing interactions are required. The first option is just a shortcut
for second.

