// IMPORTS =========================================================================================
var Path = require("path");
var Gulp = require("gulp");
var gulpJsx = require("gulp-jsx");
var browserify = require("browserify");
var babelify = require("babelify");
var watchify = require("watchify");
var through2 = require("through2");
var runSequence = require("run-sequence");
var gulpRename = require("gulp-rename");
var gulpPlumber = require("gulp-plumber");
var vinylSource = require("vinyl-source-stream");

// OPTIONS =========================================================================================
var jsxOptions = {
  ignoreDocblock: true,
  docblockUnknownTags: true,
  jsx: "h",
  renameAttrs: {
    "for": "htmlFor",
    "class": "className",
  }
};

// TASKS ===========================================================================================
Gulp.task("build", function() {
  return Gulp.src("src/**/*.js")
    .pipe(gulpJsx(jsxOptions))
    .pipe(Gulp.dest("build"));
});

Gulp.task("bundle", function() {
  return Gulp.src("build/*/app.js")
    .pipe(through2.obj(function(file, enc, next) {
      var appName = Path.dirname(file.path).split("/").slice(-1)[0];
      var bundler = browserify("./build/" + appName + "/app.js");
      bundler.transform(babelify);
      bundler.on("update", rebundle);
      function rebundle() {
        bundler.bundle()
          .pipe(gulpPlumber())
          .pipe(vinylSource("static/" + appName + "/scripts/app.js"))
          .pipe(Gulp.dest("."))
          .on("end", next);
      }
      rebundle();
    }));
});

Gulp.task("watch-build", function() {
  return Gulp.src("build/**/app.js")
    .pipe(through2.obj(function(file, enc, next) {
      var appName = Path.dirname(file.path).split("/").slice(-1)[0];
      var bundler = watchify(browserify("./build/" + appName + "/app.js"), watchify.args);
      bundler.transform(babelify);
      bundler.on("update", rebundle);
      function rebundle() {
        bundler.bundle()
          .pipe(gulpPlumber())
          .pipe(vinylSource("static/" + appName + "/scripts/app.js"))
          .pipe(Gulp.dest("."))
          .on("end", next);
      }
      rebundle();
    }));
});

Gulp.task("dist", function() {
  return Gulp.src("./build/**/app.js")
    .pipe(through2.obj(function(file, enc, next) { // workaround for https://github.com/substack/node-browserify/issues/1044
      browserify(file.path)                        // see also https://github.com/babel/babelify/issues/46
        .transform(babelify)
        .bundle(function(err, res) {
          file.contents = res;
          next(null, file);
        });
    }))
    .pipe(gulpRename(function(path) {
      path.dirname += "/scripts";
    }))
    .pipe(Gulp.dest("static/"));
});

Gulp.task("watch-src", function() {
  Gulp.watch("src/**/*.js", ["build"]);
});

Gulp.task("default", function() {
  runSequence("build", "bundle", ["watch-src", "watch-build"]);
});

Gulp.task("dist", function() {
  runSequence("build", "bundle");
});