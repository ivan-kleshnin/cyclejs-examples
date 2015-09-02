# CycleJS examples

A practical matherial for those who succeeded with [official documentation](http://cycle.js.org/getting-started.html).

Examples are grouped into lessons and placed in narrative order.
They are meant to be reviewed one by one, sequentially. The best way of learning is comparison.
And to compare you just diff files.

There is a [documentation](./docs).

## Install

```
$ wget https://github.com/ivan-kleshnin/cyclejs-examples/archive/master.zip; unzip master.zip -d cyclejs-examples; rm master.zip
$ cd cyclejs-examples
$ npm install; bower install; bin/install
```

## Run

This repo uses [Webpack](http://webpack.github.io/) for builds and development, and
[Babel](babeljs.io) for ES6 -> ES5 convertions.

Run in dev mode (with live reload). Files are served from memory.
```
$ npm run dev
```
See index.html in example folders.

For examples with backend (since \#10) issue `$ babel-node xx-xx/backend/server.js` to run server.

## JSX

Earlier versions of this repo used JSX but now we believe that [hyperscript](https://github.com/dominictarr/hyperscript) with [hyperscript-helpers](https://github.com/ohanhi/hyperscript-helpers)
provide better experience. Benetifs are: no additional language, no additional transpilation target,
no hacks to make external tools believe this is not a React JSX, much better IDE support (common JS) and you can comment single lines again!
The number of brackes is even lower and readability is subjectively at the very same level.
So JSX is just does not worth it.

## Lint

```
$ npm run eslint -s (mute node output)
```

## Lessons

### [1. Gentle Introduction](docs/lessons-1.md)

#### 1.1: Hello Nodes

#### 1.2: Hello Components

#### 1.3: Hello Apps

### [2. Reimplementing React examples](docs/lessons-2.md)

#### 2.00: Timer Basic

#### 2.01: Timer Control

#### 2.02: Timer Control 2

#### 2.03: Timer Stopwatch

#### 2.10: Menu Stateless

#### 2.11: Menu Stateful

### 99. [Tetris Game](https://github.com/ivan-kleshnin/tetris-cyclejs)

There will be more.

## Useful links

* [Marble diagrams of Rx operators](http://rxmarbles.com/)
* [RxJS documentation](https://github.com/Reactive-Extensions/RxJS/tree/master/doc)
* [Web app dataflows](https://github.com/Paqmind/dataflows)

