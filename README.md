# CycleJS example apps

Derived from and inspired by CycleJS [examples](https://github.com/staltz/cycle/tree/master/examples/).
ES6 syntax, JSX views.

Examples are given in narrative order and we recommend to review them sequentially.
The best way of learning is comparison. And to compare you just diff files.

Tutorial text is available at the beginning of each app file.

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
and URL endpoints. Frontend is a sequence of independent apps with a few common files.

```
bin
  > install -- a few installation steps
  > env -- add node_modules/.bin to $PATH (required to run scripts outside of `$ npm run`)

frontend
  > 1.1-hello-cycle -- example #1.1
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

### 1. Gentle Introduction

#### \#1.1 Hello: cycle
Input tracking, multiple files.

#### \#1.2 Hello: streams
Your first component. Static.

## Useful links

* [Marble diagrams of Rx operators](http://rxmarbles.com/)
* [RxJS documentation](https://github.com/Reactive-Extensions/RxJS/tree/master/doc)
* [Comparison of web app architectures](https://github.com/Paqmind/reactive)
