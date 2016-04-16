"use strict";

let Path = require("path")
let Webpack = require("webpack")

let app = process.argv[3].split("/")[0]

module.exports = {
  // webpack.github.io/docs/configuration.html#target
  target: "web",

  // webpack.github.io/docs/configuration.html#entry
  entry: {
    [app]: `./${app}/src/app`,
  },

  output: {
    // webpack.github.io/docs/configuration.html#output-path
    path: Path.resolve(__dirname, process.argv[3]),

    // webpack.github.io/docs/configuration.html#output-filename
    filename: "bundle.js",

    // webpack.github.io/docs/configuration.html#output-publicpath
    publicPath: "/",

    // webpack.github.io/docs/configuration.html#output-pathinfo
    pathinfo: true,
  },

  // webpack.github.io/docs/configuration.html#debug
  debug: true,

  // webpack.github.io/docs/configuration.html#devtool
  devtool: "source-map",

  // webpack.github.io/docs/configuration.html#module
  module: {
    loaders: [ // webpack.github.io/docs/loaders.html
      // JS: github.com/babel/babel-loader
      {test: /\.js$/, loaders: ["babel"], exclude: /node_modules/},
    ],
  },
}
