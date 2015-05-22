# CycleJS examples

Derived from and inspired by CycleJS [examples](https://github.com/staltz/cycle/tree/master/examples/).
Use ES6 and JSX syntax.

Examples are grouped into lessons and placed in narrative order in tutorial-like way.
They are meant to be reviewed one by one, sequentially. Every example is accompanied
by a tutorial text (see links below). To review examples you install and run app and inspect app files.
The best way of learning is comparison. And to compare you just diff files.

## Description

This project will provide frontend-only examples of CycleJS apps.
Examples with a backend would be an overkill for beginners and would require much more complex build
processes to support. Additional projects will be created to cover such cases.

## Install

```
$ wget https://github.com/ivan-kleshnin/cyclejs-examples/archive/master.zip; unzip master.zip -d cyclejs-examples; rm master.zip
$ cd cyclejs-examples
$ npm install; bower install; bin/install
```

## Run

This repo uses [Webpack](http://webpack.github.io/) for builds and development, and
[Babel](babeljs.io) for ES6 -> ES5 convertions.

Rebuild examples.
```
$ npm run build
```

Run in dev mode (with live reload). Files are served from memory.
```
$ npm run dev
```

## Lessons

### [1. Gentle Introduction](docs/lessons-1.md)

### ...coming

## Useful links

* [Marble diagrams of Rx operators](http://rxmarbles.com/)
* [RxJS documentation](https://github.com/Reactive-Extensions/RxJS/tree/master/doc)
* [Web app architectures](https://github.com/Paqmind/reactive)

