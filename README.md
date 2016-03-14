# CycleJS examples

Mostly incremental examples for those who finished an [official documentation](http://cycle.js.org/getting-started.html)
or [EggHead course](https://egghead.io/lessons/rxjs-overview-of-cycle-js) and wants more.

Examples are grouped into lessons and placed in narrative order.
They are meant to be reviewed one by one, sequentially.
The best way of learning is comparison. And to compare you just diff files.

## Install

1. Download and unzip repo
2. `$ npm install http-server -g`
3. `$ npm install`

## Run

This repo uses single webpack config and single `node_modules` folder to simplify project management.

1. Uncomment an example line in `entry` section of `webpack.config.js`.
2. `$ npm run dev`
3. `$ http-server {example-folder}`

We recommend to serve `index.html` from HTTP like described above rather that just open them as files.
Many things in browser (history, CORS support) are blocked / unavailable for `file://` protocol.

## Learn

:turtle: