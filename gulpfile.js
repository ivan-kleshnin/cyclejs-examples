// IMPORTS =========================================================================================
var ChildProcess = require("child_process");
var Gulp = require("gulp");
var gulpJsx = require("gulp-jsx");
var gulpPlumber = require("gulp-plumber");
var browserify = require("browserify");
var watchify = require("watchify");
var runSequence = require("run-sequence");

// OPTIONS =========================================================================================
var exitOnError = false;

var jsxOptions = {
  ignoreDocblock: true,
  docblockUnknownTags: true,
  jsx: "h",
  renameAttrs: {
    "for": "htmlFor",
    "class": "className",
  }
};

let apps = [
  "0-timer",
  "1-hello",
  "2-slider-intro",
  "3-slider-state",
  "4-slider-multiple",
  //"5-slider-colors",
];

let libraries = [
  "cyclejs",
  "lodash.sortby",
  "lodash.values",
  "node-uuid",
  "object.assign",
];

require("events").EventEmitter.defaultMaxListeners = 999;

// HELPERS =========================================================================================
function interleaveWith(array, prefix) {
  return array.reduce((memo, val) => {
    return memo.concat([prefix]).concat([val]);
  }, []);
}

function gulpTo5(opts) {
  return gulp6to5(Object.assign({
    experimental: true
  }, opts));
}

// TASKS ===========================================================================================
Gulp.task("build", function() {
  return Gulp.src("src/**/*.js")
    .pipe(gulpPlumber({errorHandler: !exitOnError}))
    .pipe(gulpJsx(jsxOptions))
    .pipe(Gulp.dest("build"));
});

Gulp.task("bundle-vendors", function() {
  // $ browserify -d -r cyclejs [-r ...] -o ./static/scripts/vendors.js
  let args = ["-d"]
    .concat(interleaveWith(libraries, "-r"))
    .concat(["-o", "./static/scripts/vendors.js"]);

  process.setMaxListeners(999);
  let bundler = ChildProcess.spawn("browserify", args);
  bundler.setMaxListeners(999);
  bundler.stdout.pipe(process.stdout);
  bundler.stderr.pipe(process.stderr);
  bundler.on("exit", function(code) {
    if (exitOnError && code) {
      process.exit(code);
    }
  });
});

Gulp.task("bundle-apps", function() {
  apps.forEach(function(app) {
    // $ browserify -d -x cyclejs [-x ...] ./build/{app}/app.js -o ./static/{app}/scripts/app.js
    let args = ["-d"]
      .concat(interleaveWith(libraries, "-x"))
      .concat(["./build/" + app + "/app.js"])
      .concat(["-o", "./static/" + app + "/scripts/app.js"]);

    let bundler = ChildProcess.spawn("browserify", args);
    bundler.stdout.pipe(process.stdout);
    bundler.stderr.pipe(process.stderr);
    bundler.on("exit", function(code) {
      if (exitOnError && code) {
        process.exit(code);
      }
    });
  });
});

Gulp.task("watch-build", function() {
  apps.forEach(function(app) {
    // $ watchify -v -d -x react -x reflux [-x ...] ./build/{app}/app.js -o ./static/{app}/scripts/app.js
    let args = ["-v", "-d"]
      .concat(interleaveWith(libraries, "-x"))
      .concat(["./build/" + app + "/app.js"])
      .concat(["-o", "./static/" + app + "/scripts/app.js"]);

    let watcher = ChildProcess.spawn("watchify", args);
    watcher.stdout.pipe(process.stdout);
    watcher.stderr.pipe(process.stderr);
  });
});

Gulp.task("watch-src", function() {
  Gulp.watch("src/**/*.js", ["build"]);
});

// TASK DEPS =======================================================================================
Gulp.task("default", function() {
  runSequence("build", "bundle-vendors", "bundle-apps", ["watch-src", "watch-build"]);
});

Gulp.task("dist", function() {
  exitOnError = true;
  runSequence("build", "bundle");
});