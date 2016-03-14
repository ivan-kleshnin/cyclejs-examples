# CycleJS examples

Mostly incremental examples for those who finished an [official documentation](http://cycle.js.org/getting-started.html)
or [EggHead course](https://egghead.io/lessons/rxjs-overview-of-cycle-js) and wants more.

Examples are grouped into lessons and placed in narrative order.
They are meant to be reviewed one by one, sequentially.
The best way of learning is comparison. And to compare you just diff files.

## Install

1. Download and unzip repo
2. Install static server with `$ npm install http-server -g`
3. Install packages with `$ npm install`

## Run

This repo uses single webpack config and single `node_modules` folder to simplify project management.

1. Uncomment an example line in `entry` section of `webpack.config.js`.
2. Run webpack with `$ npm run dev`
3. Run static server with `$ http-server {example-folder}`
4. See `localhost:8080`

We recommend to open `index.html` with `http://` rather than `file://` (as described above) because
many things in browser just don't work for `file://` (history, CORS, etc.).

## Learn

:turtle: