"use strict";

let Path = require("path")
let Webpack = require("webpack")

module.exports = {
  // webpack.github.io/docs/configuration.html#target
  target: "web",

  // webpack.github.io/docs/configuration.html#entry
  entry: {
    // "1.0-form": "./1.0-form/src/app",
    // "1.1-form": "./1.1-form/src/app",
    // "1.2-form": "./1.2-form/src/app",
    // "1.3-form": "./1.3-form/src/app",
    // "1.4-form": "./1.4-form/src/app",
    // "1.5-form": "./1.5-form/src/app",
    // "x.x-form": "./x.x-form/src/app",
    // "x.y-form": "./x.y-form/src/app",
    // "x.z-form": "./x.z-form/src/app",
    // "2.0-routing": "./2.0-routing/src/app",
    // "2.1-routing": "./2.1-routing/src/app",
    // "2.2-routing": "./2.2-routing/src/app",
    // "2.3-routing": "./2.3-routing/src/app",
  },

  output: {
    // webpack.github.io/docs/configuration.html#output-path
    path: __dirname,

    // webpack.github.io/docs/configuration.html#output-filename
    filename: "public/bundle.js",

    // webpack.github.io/docs/configuration.html#output-publicpath
    publicPath: "http://localhost:2992/",

    // webpack.github.io/docs/configuration.html#output-pathinfo
    pathinfo: true,
  },

  // webpack.github.io/docs/configuration.html#debug
  debug: true,

  // webpack.github.io/docs/configuration.html#devtool
  devtool: "source-map",

  // webpack.github.io/docs/configuration.html#module
  // module: {
  //   loaders: [ // webpack.github.io/docs/loaders.html
  //     // JS
  //     {test: /\.js$/, loaders: ["babel?stage=0"], exclude: /node_modules/},
  //   ],
  // },

  // webpack.github.io/docs/configuration.html#resolve
  // resolve: {
  //   // node_modules and like that
  //   modulesDirectories: ["web_modules", "node_modules"],
  // },

  // webpack.github.io/docs/configuration.html#resolveloader
  // resolveLoader: {
  //   // Abs. path with loaders
  //   root: Path.join(__dirname, "/node_modules"),
  //
  //   alias: {},
  // },

  // webpack.github.io/docs/list-of-plugins.html
  // plugins: [
  //   new Webpack.NoErrorsPlugin(),
  //   new Webpack.IgnorePlugin(/^vertx$/),
  // ],
}
