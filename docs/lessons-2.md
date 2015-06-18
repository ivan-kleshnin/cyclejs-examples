# Lesson 2: Reimplementing React examples

## 2.00: Timer Basic

Let's reimplement the simplest timer example from [TutorialZine](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/)

Two nodes are enough here: Model and View.
Model exposes the stream of timedeltas.

```js
Observable.interval(100)
  .map(() => Date.now() - started)
```

View renders this value in a human readable way.
We don't need Intent cause there is no interaction with the DOM (yet).

## 2.01: Timer Control

How about more complex example with control buttons?
Stop button releases the stream of timedeltas with this code.

```js
Observable.interval(100)
  .takeUntil(stop$),
```

To pause and resume the timer we can use `.pausable()` operator of RxJS.
It takes an Obserable of booleans where `true` means "run" and `false` means "don't run".
Simple enough.

So, with just this one operator we get a desired control over stream:

```js
msSinceStart$: Observable.interval(100)
  .pausable(run$.startWith(true))
  .map(() => Date.now() - started)
  .takeUntil(stop$),
```

## 2.02: Timer Control 2

Well, not so fast. You probably noticed that the Resume button works strange.
Like the timer is not really stopped but rather displaying of numbers were blocked.
We want the timer to continue counting from the value it was stopped on,
no matter how long ago it was. Also, to make it more interesting, let's keep both features available.

Let's call this fourth button "Continue".

The continue-able timer can no longer rely on "hardcoded" timedelta.
It rather should be a counter. So we need a state.

The simplest version of which can be built on top of a `scan` function.

```js
Observable.interval(100)
  .scan(0, delta => delta + 100),
```

This function does two things:

1. Builds new value from the previous on every tick
2. Sends new value down the stream

That would be enough for such timer but we wanted to support both Resume and Continue features.
To implement Resume in terms of counter we need to save an idle time as well.

```js
let timerIdle$ = run$
  .filter(data => !data) // pass only true => false transitions (timer is stopped)
  .timeInterval()
  .pluck("interval")
  .sample(intentions.resume$)
  .startWith(0);
```

In the code above `timerIdle$` is an Observable of timedeltas passed since each run.
We need to take this value into account only when Resume is pressed so we sample a stream with it.

Our resulting Observable then looks like this:

```js
Observable.interval(100)
  .pausable(run$.startWith(true))
  .map(() => 0)
  .merge(timerIdle$, (_, idle) => idle)
  .scan(0, (delta, idle) => delta + 100 + idle)
  .takeUntil(stop$),
```

## 2.03: Timer Stopwatch

Ready for something more ambitious? Good, let's create semi-realistic mechanical stopwatch emulation
with adequate visual representation. Simplest stopwatches can have only one
button which runs, pauses, resets and runs the timer again on consequent presses.
Just google some video if you need a visual clue. More advanced double-button stopwatches can also **continue** after **stop**
by separating reset to a distinct button. But we're going to stick with a single-button case
which can count timedeltas up to one minute.

Our stopwatch basically has two states: arrow state and button state.
Arrow state can be created on top of an Observable `interval` and button state is basically a
finite state-machine. Next button state is expressed by formula `(previousState + 1) % 3`.

Dataflow is quite simple and variable meanings should be self-speaking.

```js
function seedState() {
  return {
    watch: 0, // state: 0 = stopped, 1 = running, 2 = paused
    value: 0, // timer value in milliseconds
  };
}
```

An interesting question is how make an arrow movement smooth.
We can select smaller interval like 100ms or 50ms but in this case we're charging CPU with
a lot of worthless load. CSS transitions is much more viable solution.

To emulate arrow rotation this two properties are embedded as local styles:

```CSS
transform: rotate(${angle}deg);
transition-duration: `${TICK_MS / 1000}s;
```

They have to be in JS because their values are derived from variables.

To add a slightly exagerrated arrow bounce we have a `transition-timing-function`
setted to `cubic-bezier`.

And we also need to have a different animation preferences for arrow resets.
We keep third `valueBeforeReset` state value just to be able to evaluate correct transition time
for counter-clockwise arrow movement after main value was resetted.

`Observable.interval` counts forever but there is no sense in
broadcasting repeating values.<br/>
`.distinctUntilChanged()` is a very convenient operator which can help
with this issue. It cuts consequent repeating items keeping outer layers unaware of inner buzz.

## 2.10: Menu Stateless

Let's reimplement the simplest menu example from [TutorialZine](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/)
Important question: should our components be stateful or stateless?

Experience from React totally applies here.
It's better to create stateless components whenever possible.
But is it possible in this case?

Menu may be stateless if it exposes it's interactions to the outer world.
If the chosen option holds a business value and it represents something in an app state (or URL)
there is just no reason in duplicating that state in component.

On the flip side, if menu is just a fancy toggler like dropdown and does not affect anything external,
it has to be implemented in a stateful way.

We're going to implement Menu in a stateless way first.

The code is pretty simple and probably requires no explanations.

App holds the menu state and what item is active now,
is decided by an application via component properties.

```js
<app-menu items={items} active={active} key="1"/>
```

## 2.11: Menu Stateful

We also can combine both approaches and keep state both in app and componet.
While it's an overkill it's probably good for learning purposes.

The interesting point here is the usage of `shareReplay` operator.

```js
function Model(intentions, props) {
  return {
    items$: props.get("items")
      .startWith([])
      .shareReplay(1), // <- !!!
    ...
  }
}
```

Every time Observer subscribes to the Observable either new stream may be created or the old one reused.
Second behavior it the default so we change it.
`shareReplay(1)` basically means: "reuse existing Observable for every
new Observer attached, giving him one last (current) value".

TODO: give a link to the visual or better explanation.

As a rule of thumb, you will want to apply `shareReplay(1)` to every Observable
that is exposed from component except `vtree$`. That should be enough for this moment.
