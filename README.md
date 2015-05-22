# CycleJS examples

Derived from and inspired by CycleJS [examples](https://github.com/staltz/cycle/tree/master/examples/).
Use ES6 and JSX syntax.

Examples are grouped into lessons and placed in narrative order in tutorial-like way.
They are meant to be reviewed one by one, sequentially. Every example is accompanied
by a tutorial text (see links below). To review examples you install and run app and inspect app files.
The best way of learning is comparison. And to compare you just diff files.

## Install

```
$ wget https://github.com/ivan-kleshnin/cyclejs-examples/archive/master.zip; unzip master.zip -d cyclejs-examples; rm master.zip
$ cd cyclejs-examples
$ npm install; bower install; bin/install
```

## Run

This repo uses [Webpack](http://webpack.github.io/) for builds and development.
[Babel](babeljs.io) is used for ES6 -> ES5 syntax convertions.

Rebuild examples
```
$ npm run build
```

Run in dev mode (with live reload). Files are server from memory
```
$ npm run dev
```

## Examples

### Lesson 1: Gentle Introduction

#### 1.0: Hello Cycle
[Docs](docs/lessons-1.md/#1.0)

#### 1.1: Hello Component
[Docs](docs/lessons-1.md/#1.1)

#### 1.2: Hello Nodes
[Docs](docs/lessons-1.md/#1.2)

## Useful links

* [Marble diagrams of Rx operators](http://rxmarbles.com/)
* [RxJS documentation](https://github.com/Reactive-Extensions/RxJS/tree/master/doc)
* [Web app architectures](https://github.com/Paqmind/reactive)

