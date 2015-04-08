# CycleJS example apps

--

**Note from April 08, 2015**

CycleJS is going through breaking changes on API now. For newcomers it's better to review #streams branch
which probably be pushed into master soon.

--

Derived from and inspired by CycleJS [examples](https://github.com/staltz/cycle/tree/master/examples/).
ES6 syntax, JSX views.

Examples are given in narrative order and we recommend to review them sequentially.
The best way of learning is comparison. And to compare you just diff files.

TODO setup demo instance

## Install

```
$ wget https://github.com/ivan-kleshnin/cyclejs-examples/archive/master.zip; unzip master.zip -d cyclejs-examples; rm master.zip
$ cd cyclejs-examples
$ npm install; bower install; bin/install
```

## Run

```
$ npm start -- run without watches
$ npm run devel -- run with watches
```

## Project structure
Project includes backend and frontend part. Backend is **[ExpressJS](https://github.com/strongloop/express)** + **[Nunjucks](https://github.com/mozilla/nunjucks)** based.
Frontend is obviously **[CycleJS](https://github.com/staltz/cycle)**. Backend is common for all examples. It powers API
and URL endpoints. Frontend is a sequence of independent apps which a few common files.

```
bin
  > install -- a few installation steps
  > env -- add node_modules/.bin to $PATH (required to run scripts outside of `$ npm run`)

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
Try to implement the same example having only `setTimeout` and `setInterval` in your toolbelt.

### \#1.3 Timer: smart
Timer with two stop modes.
Try to implement the same example having only `setTimeout` and `setInterval` in your toolbelt.

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

## Useful links

* [Marble diagrams of Rx operators](http://rxmarbles.com/)
* [RxJS documentation](https://github.com/Reactive-Extensions/RxJS/tree/master/doc)
* [Comparison of web app architectures](https://github.com/Paqmind/reactive)
