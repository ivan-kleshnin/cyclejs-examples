// IMPORTS =========================================================================================
var Path = require("path");
var ChildProcess = require("child_process");
var Glob = require("glob");
var Gulp = require("gulp");
var gulpJsx = require("gulp-jsx");
var gulpPlumber = require("gulp-plumber");
var runSequence = require("run-sequence");
var mkdirp = require("mkdirp");
var frontendVendors = require("./package.json").frontendVendors;

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

var apps = Glob.sync("./src/*/").map(function(path) { return Path.basename(path); });

require("events").EventEmitter.defaultMaxListeners = 999;

// HELPERS =========================================================================================
function interleaveWith(array, prefix) {
  return array.reduce(function(memo, val) {
    return memo.concat([prefix]).concat([val]);
  }, []);
}

// TASKS ===========================================================================================
Gulp.task("dist-html", function() {
  return Gulp.src(["./src/**/*.html"])
    .pipe(gulpPlumber({errorHandler: !exitOnError}))
    .pipe(Gulp.dest("./dist/"));
});

Gulp.task("dist-css", function() {
  return Gulp.src(["./src/**/*.css"])
    .pipe(gulpPlumber({errorHandler: !exitOnError}))
    .pipe(Gulp.dest("./dist/"));
});

Gulp.task("dist-less", function() {
//  return Gulp.src(["./frontend/styles/theme.less", "./frontend/styles/http-errors.less"])
//    .pipe(gulpPlumber({errorHandler: !exitOnError}))
//    .pipe(gulpLess())
//    .pipe(Gulp.dest("./dist/styles"));
});

Gulp.task("build", function() {
  return Gulp.src("src/**/*.js")
    .pipe(gulpPlumber({errorHandler: !exitOnError}))
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

Gulp.task("prebundle-apps", function() {
  apps.forEach(function(app) {
    mkdirp.sync("dist/" + app + "/scripts/");
  });
});

Gulp.task("bundle-apps", ["prebundle-apps"], function() {
  apps.forEach(function(app) {
    // $ browserify -d -x cyclejs [-x ...] ./build/{app}/scripts/app.js -o ./dist/{app}/scripts/app.js
    var args = ["-d"]
      .concat(interleaveWith(frontendVendors, "-x"))
      .concat(["./build/" + app + "/scripts/app.js"])
      .concat(["-o", "./dist/" + app + "/scripts/app.js"]);

    var bundler = ChildProcess.spawn("browserify", args);
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
    // $ watchify -v -d -x react -x reflux [-x ...] ./build/{app}/app.js -o ./dist/{app}/scripts/app.js
    var args = ["-v", "-d"]
      .concat(interleaveWith(frontendVendors, "-x"))
      .concat(["./build/" + app + "/app.js"])
      .concat(["-o", "./dist/" + app + "/scripts/app.js"]);

    var watcher = ChildProcess.spawn("watchify", args);
    watcher.stdout.pipe(process.stdout);
    watcher.stderr.pipe(process.stderr);
  });
});

Gulp.task("watch-src", function() {
  Gulp.watch("src/**/*.js", ["build"]);
});

// TASK DEPS =======================================================================================
Gulp.task("default", function() {
  runSequence(
    ["dist-html", "dist-css", "dist-less"],
    "build",
    ["bundle-vendors", "bundle-apps"],
    ["watch-src", "watch-build"]
  );
});

Gulp.task("dist", function() {
  exitOnError = true;
  runSequence(
    ["dist-html", "dist-css", "dist-less"],
    "build",
    ["bundle-vendors", "bundle-apps"]
  );
});