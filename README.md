# CycleJS examples

Derived from and inspired by CycleJS [examples](https://github.com/staltz/cycle/tree/master/examples/).
Use ES6 and JSX syntax.

Examples are grouped into lessons and placed in narrative order in tutorial-like way.
They are meant to be reviewed one by one, sequentially. Every example is accompanied
by a tutorial text (see links below). To review examples you install and run app and inspect app files.
The best way of learning is comparison. And to compare just run diff tool.

TODO setup demo instance

## Install

```
$ wget https://github.com/ivan-kleshnin/cyclejs-examples/archive/master.zip; unzip master.zip -d cyclejs-examples; rm master.zip
$ cd cyclejs-examples
$ npm install; bower install; bin/install
```

Note that `bin/install` depends on `greadlink` being in your path. On OSX, you can run `brew install coreutils` to install it. (more info)[http://stackoverflow.com/questions/1055671/how-can-i-get-the-behavior-of-gnus-readlink-f-on-a-mac]


## Run

```
$ npm start -- run without watches
$ npm run devel -- run with watches
```

## Project structure
Project includes backend and frontend part. Backend is **[ExpressJS](https://github.com/strongloop/express)** + **[Nunjucks](https://github.com/mozilla/nunjucks)** based.
Frontend is obviously **[CycleJS](https://github.com/staltz/cycle)**. Backend is common for all examples. It
serves static files in simplest cases and powers API / url endpoints in more complex. Frontend consists from
independent apps with a few common files.

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

### Lesson 1: gentle introduction

#### Example 1.1: hello cycle
[Meet cycle](docs/lessons-1.md/#1.1)

#### Example 1.2: hello streams
[Meet streams](docs/lessons-1.md/#1.2)

#### Example 1.3: hello nodes
[Meet nodes](docs/lessons-1.md/#1.3)

## Useful links

* [Marble diagrams of Rx operators](http://rxmarbles.com/)
* [RxJS documentation](https://github.com/Reactive-Extensions/RxJS/tree/master/doc)
* [Comparison of web app architectures](https://github.com/Paqmind/reactive)
