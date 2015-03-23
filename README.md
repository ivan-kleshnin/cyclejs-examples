# CycleJS example apps

Derived from CycleJS [examples](https://github.com/staltz/cycle/tree/master/examples/).
Narrative examples with ES6 syntax and JSX views. All that you like.
There will be more.

## Examples

\#1.1 [Timer](examples/1.1-timer) – simplest timer. Compare to React [version](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/).

\#1.2 [Timer: more](examples/1.2-timer-more) – timer with control buttons.

\#2.1 [Hello: input](examples/2.1-hello-input) – input tracking, multiple files.

\#2.2 [Hello: footer](examples/2.1-hello-footer) – example of static component.

\#3.1 [Slider: intro](examples/3.1-slider-intro) – input tracking with slider.

\#3.2 [Slider: state](examples/3.2-slider-state) – reimplement state.

\#3.3 [Slider: multiple](examples/3.3-slider-multiple) – add/remove sliders.

\#3.4 [Slider: colors](examples/3.4-slider-colors) – more attributes.

\#4.1 [Menu: basic](examples/4.1-menu-basic) – simplest menu. Compare to React [version](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/).

\#4.2 [Menu: form](examples/4.1-menu-form) – menu & order form. Compare to React [version](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/).

\#4.3 [Menu: stream](examples/4.3-menu-stream) – combine automatic and custom selections.

\#5.1 [Search: client](examples/5.1-search-client) – search (no API). Compare to React [version](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/).

*See index.html in browser*

## Learn

See index.html in example folders. Examples are given in order of increasing complexity so it's better to review them sequentially.
Every next app in a single group contains minimal meaningful changeset to the previous one.
The best way of learning is comparison. And to compare you just diff files.

## Practice

Distributions are under VCS. To rebuild, run this from root folder:

```
$ npm install
$ bower install
$ bin/fixes/globule // remove broken lodash dependency
$ bin/distall       // rebuild all examples
```

And/or this, from chosen example folder:

```
$ gulp dist  // rebuild
$ gulp       // rebuild & watch
```

## See also

* [Comparison of "reactive" architectures](https://github.com/Paqmind/reactive)