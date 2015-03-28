// IMPORTS =========================================================================================
var Path = require("path");
var ChildProcess = require("child_process");
var Glob = require("glob");
var Gulp = require("gulp");
var gulpJsx = require("gulp-jsx");
var gulpCached = require("gulp-cached");
var gulpPlumber = require("gulp-plumber");
var runSequence = require("run-sequence");
var mkdirp = require("mkdirp");
var frontendVendors = require("../../package.json").frontendVendors;

// OPTIONS =========================================================================================
var exitOnError = false;

var jsxOptions = {
  ignoreDocblock: true,
  docblockUnknownTags: true,
  unknownTagsAsString: true,
  jsx: "h",
  renameAttrs: {
    "for": "htmlFor",
    "class": "className",
  }
};

var apps = Glob.sync("./src/*/").map(function(path) { return Path.basename(path); });

// HELPERS =========================================================================================
function interleaveWith(array, prefix) {
  return array.reduce(function(memo, val) {
    return memo.concat([prefix]).concat([val]);
  }, []);
}

// TASKS ===========================================================================================
Gulp.task("build", function() {
  return Gulp.src("src/**/*.js")
    .pipe(gulpPlumber({errorHandler: !exitOnError}))
    .pipe(gulpCached("build"))
    .pipe(gulpJsx(jsxOptions))
    .pipe(Gulp.dest("build"));
});

Gulp.task("bundle-vendors", function() {
  // $ browserify -d -r cyclejs [-r ...] -o ./dist/scripts/vendors.js
  var args = ["-d"]
    .concat(interleaveWith(frontendVendors, "-r"))
    .concat(["-o", "./dist/scripts/vendors.js"]);

  var bundler = ChildProcess.spawn("browserify", args);
  bundler.stdout.pipe(process.stdout);
  bundler.stderr.pipe(process.stderr);
  bundler.on("exit", function(code) {
    if (exitOnError && code) {
      process.exit(code);
    }
  });
});

Gulp.task("prebundle-app", function() {
  mkdirp.sync("dist/scripts/");
});

Gulp.task("bundle-app", ["prebundle-app"], function() {
  // $ browserify -d -x cyclejs [-x ...] ./build/{app}/scripts/app.js -o ./dist/{app}/scripts/app.js
  var args = ["-d"]
    .concat(interleaveWith(frontendVendors, "-x"))
    .concat(["./build/scripts/app.js"])
    .concat(["-o", "./dist/scripts/app.js"]);

  var bundler = ChildProcess.spawn("browserify", args);
  bundler.stdout.pipe(process.stdout);
  bundler.stderr.pipe(process.stderr);
  bundler.on("exit", function(code) {
    if (exitOnError && code) {
      process.exit(code);
    }
  });
});

Gulp.task("dist-css", function() {
  return Gulp.src(["./src/**/*.css"])
    .pipe(gulpPlumber({errorHandler: !exitOnError}))
    .pipe(Gulp.dest("./dist/"));
});

Gulp.task("watch-build", function() {
  // $ watchify --delay 0 -v -d -x cycle [-x ...] ./build/{app}/scripts/app.js -o ./dist/{app}/scripts/app.js
  var args = ["-v", "-d", "--delay 0"]
    .concat(interleaveWith(frontendVendors, "-x"))
    .concat(["./build/scripts/app.js"])
    .concat(["-o", "./dist/scripts/app.js"]);

  var watcher = ChildProcess.spawn("watchify", args);
  watcher.stdout.pipe(process.stdout);
  watcher.stderr.pipe(process.stderr);
});

Gulp.task("watch-src", function() {
  Gulp.watch("src/**/*.js", ["build"]);
  Gulp.watch("src/**/*.css", ["dist-css"]);
});

// TASK DEPS =======================================================================================
Gulp.task("default", function() {
  runSequence(
    ["dist-css"],
    "build",
    ["bundle-vendors", "bundle-app"],
    ["watch-src", "watch-build"]
  );
});

Gulp.task("dist", function() {
  exitOnError = true;
  runSequence(
    ["dist-css"],
    "build",
    ["bundle-vendors", "bundle-app"]
  );
});