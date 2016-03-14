"use strict";

let Path = require("path")
let Webpack = require("webpack")

module.exports = {
  // Compilation target http://webpack.github.io/docs/configuration.html#target
  target: "web",

  // Entry files http://webpack.github.io/docs/configuration.html#entry
  entry: {
    "1.0-hello-cycle": "./1.0-hello-cycle/src/app",
    //"1.1-hello-nodes": "./1.1-hello-nodes/scripts/app",
    //"1.2-hello-components": "./1.2-hello-components/scripts/app",
    //"1.3-hello-apps": "./1.3-hello-apps/scripts/app",
    //"2.00-timer-basic": "./2.00-timer-basic/scripts/app",
    //"2.01-timer-control": "./2.01-timer-control/scripts/app",
    //"2.02-timer-control2": "./2.02-timer-control2/scripts/app",
    //"2.03-timer-stopwatch": "./2.03-timer-stopwatch/scripts/app",
    //"2.10-menu-stateless": "./2.10-menu-stateless/scripts/app",
    //"2.11-menu-stateful": "./2.11-menu-stateful/scripts/app",
    //"10.0-routing-custom": "./10.0-routing-custom/frontend/client",
    //"10.1-routing-router5": "./10.1-routing-router5/frontend/client",
    //"10-isomorphic": "./10-isomorphic/frontend/client",
    // "100-test": "./100-test/frontend/client",
  },

  // Output files http://webpack.github.io/docs/configuration.html#output
  output: {
    // Abs. path to output directory http://webpack.github.io/docs/configuration.html#output-path
    path: __dirname,

    // Filename of an entry chunk http://webpack.github.io/docs/configuration.html#output-filename
    filename: "[name]/public/bundle.js",

    // Web path (used to prefix URLs) http://webpack.github.io/docs/configuration.html#output-publicpath
    publicPath: "http://localhost:2992/",

    // ??? http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
    // sourceMapFilename: "debugging/[file].map",

    // Include pathinfo in output (like `require(/*./test*/23)`) http://webpack.github.io/docs/configuration.html#output-pathinfo
    // pathinfo: true,
  },

  // Debug mode: http://webpack.github.io/docs/configuration.html#debug
  // debug: true,

  // Enhance debugging: http://webpack.github.io/docs/configuration.html#devtool
  // devtool: "source-map",

  // Capture timing information: http://webpack.github.io/docs/configuration.html#profile
  // profile: true,

  // Module: http://webpack.github.io/docs/configuration.html#module
  // module: {
  //   loaders: [ // http://webpack.github.io/docs/loaders.html
  //     // JS
  //     {test: /\.js$/, loaders: ["babel?stage=0"], exclude: /node_modules/},
  //   ],
  // },

  // Module resolving: http://webpack.github.io/docs/configuration.html#resolve
  // resolve: {
  //   // node_modules and like that
  //   modulesDirectories: ["web_modules", "node_modules"],
  // },

  // Loader resolving: http://webpack.github.io/docs/configuration.html#resolveloader
  // resolveLoader: {
  //   // Abs. path with loaders
  //   root: Path.join(__dirname, "/node_modules"),
  //
  //   alias: {},
  // },

  // Plugins: http://webpack.github.io/docs/list-of-plugins.html
  // plugins: [
  //   //new Webpack.HotModuleReplacementPlugin(),
  //   new Webpack.NoErrorsPlugin(),
  //   new Webpack.IgnorePlugin(/^vertx$/),
  // ],

  // Options for dev server: http://webpack.github.io/docs/webpack-dev-server.html
  // devServer: {
  //   hot: false,
  //   noInfo: false,
  // },
}
