# CycleJS example apps

Derived from CycleJS [examples](https://github.com/staltz/cycle/tree/master/examples/).
Narrative examples with ES6 syntax and JSX views. All that you like.
There will be more.

TODO setup demo instance

## Project structure
Project includes backend and frontend part. Backend is **[ExpressJS](https://github.com/strongloop/express)** + **[Nunjucks](https://github.com/mozilla/nunjucks)** based.
Frontend is obviously **[CycleJS](https://github.com/staltz/cycle)**. Backend is common for all examples. It powers API
and URL endpoints. Frontend is a sequence of independent apps which a few common files.

```
frontend
  > 1.1-timer -- example #1.1
    > scripts -- frontend APP
    > styles -- app styles
  > ...
  > common -- common files
    > scripts -- common scripts
    > styles -- common styles

backend
  > scripts -- backend APP, API
  > templates -- nunjucks templates

shared
  > config -- config folder
```

## Examples

### \#1.1 Timer
Simplest timer. Compare to [React version](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/).
CycleJS is basically RxJS + VirtualDOM + DataFlowNodes

### \#1.2 Timer: more
Timer with control buttons.
Try to reproduce the same having only `setTimeout` and `setInterval` in your toolbelt.

### \#2.1 Hello: input
Input tracking, multiple files.

### \#2.2 Hello: footer
Your first component. Static.

### \#3.1 Slider: intro
Input tracking with slider.

### \#3.2 Slider: state
Reimplement state management for slider.

### \#3.3 Slider: multiple
Multiple slider. Kinda CRUD

### \#3.4 Slider: colors
Add more attributes with ease

### \#4.1 Menu: basic
Simplest menu. Compare to [React version](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/).

### \#4.2 Menu: form
Menu or Order form? Dunno :)
Compare to [React version](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/).

### \#4.3 Menu: fun
Combine automatic and custom selections for fun.

### \#5.1 Search: client
Search (client-only). Compare to [React version](http://tutorialzine.com/2014/07/5-practical-examples-for-learning-facebooks-react-framework/).

### \#5.2 Search: API
TODO: implement, add description

### \#6.1 Favs: single
TODO: add description

### \#6.2 Favs: list
TODO: add description

### \#7 Todo
TODO: implement, add description

## Learn

See index.html in example folders. Examples are given in order of increasing complexity so it's better to review them sequentially.
Every next app in a single group contains minimal meaningful changeset to the previous one.
The best way of learning is comparison. And to compare you just diff files.

## Practice

Distributions are under VCS. To rebuild, run:

```
$ npm install
$ bower install
$ gulp [gulp dist] // rebuild all examples [& watch]
```

## See also

* [Comparison of "reactive" architectures](https://github.com/Paqmind/reactive)