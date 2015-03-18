# CycleJS example apps

Derived from CycleJS [examples](https://github.com/staltz/cycle/tree/master/examples/).
Narrative examples with ES6 syntax and JSX views. All that you like.
There will be more.

## Examples

\#1.1 [Timer](https://github.com/ivan-kleshnin/cyclejs-examples/tree/master/dist/1.1-timer) – simplest timer. Compare to [React](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/) implementation.

\#2.1 [Hello: input](https://github.com/ivan-kleshnin/cyclejs-examples/tree/master/dist/2.1-hello-input) – input tracking, multiple files.

\#2.2 [Hello: footer](https://github.com/ivan-kleshnin/cyclejs-examples/tree/master/dist/2.1-hello-footer) – example of static component.

\#3.1 [Slider: intro](https://github.com/ivan-kleshnin/cyclejs-examples/tree/master/dist/3.1-slider-intro) – input tracking with slider.

\#3.2 [Slider: state](https://github.com/ivan-kleshnin/cyclejs-examples/tree/master/dist/3.2-slider-state) – reimplement state.

\#3.3 [Slider: multiple](https://github.com/ivan-kleshnin/cyclejs-examples/tree/master/dist/3.3-slider-multiple) – add/remove sliders.

\#3.4 [Slider: colors](https://github.com/ivan-kleshnin/cyclejs-examples/tree/master/dist/3.4-slider-colors) – more attributes.

\#4.1 [Menu: basic](https://github.com/ivan-kleshnin/cyclejs-examples/tree/master/dist/4.1-menu-basic) – simplest menu.

*See index.html in browser*

## Rebuild

```
$ bin/fixes/globule // remove broken lodash dependency
$ gulp dist         // rebuild all examples
$ gulp              // rebuild & watch
```

## Learn

Examples are given in order of increasing complexity so it's better to review them one-by-one.
Every next app in a single group contains minimal meaningful changeset to the previous one.
The best way of learning is comparison. And to compare you just diff files.

## Also see

* [Comparison of reactive approaches](https://github.com/Paqmind/reactive)
* [Rx marble diagrams](http://rxmarbles.com)