# Lesson 2: Fun With Timers

## 2.0: Timer Basic

Let's reimplement the simplest timer example from [TutorialZine](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/)

Two nodes are enough here: Model and View.
Model exposes the stream of timedeltas.

```js
Observable.interval(100)
  .map(() => Date.now() - started)
```

View renders this value in a human readable way.
We don't need Intent cause there is no interaction with the DOM (yet).

## 2.1: Timer Control

How about more complex example with control buttons?
Stop button releases the stream of timedeltas with this code.

```js
Observable.interval(100)
  .takeUntil(stop$),
```

To pause and resume the timer we can use the `.pausable()` operator of RxJS.
It takes an Obserable of booleans where `true` means "run" and `false` means "don't run".
Simple enough.

So, with just this one operator we get a desired control over stream:

```js
msSinceStart$: Observable.interval(100)
  .pausable(run$.startWith(true))
  .map(() => Date.now() - started)
  .takeUntil(stop$),
```

## 2.2: Timer Smart

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
To implement Resume in terms of counter we need to count an idle time as well.

```js
let timerIdle$ = run$.timeInterval()
  .filter(data => data.value) // Watch false => true transitions (resume and continue after pause)
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
