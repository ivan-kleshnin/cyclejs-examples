// IMPORTS =========================================================================================
let gulp = require("gulp");
let gulpJsx = require("gulp-jsx");
let browserify = require("browserify");
let babelify = require("babelify");
let through2 = require("through2");
let runSequence = require("run-sequence");

// OPTIONS =========================================================================================
let jsxOptions = {
  ignoreDocblock: true,
  docblockUnknownTags: true,
  jsx: "h",
  renameAttrs: {
    "for": "htmlFor",
    "class": "className",
  }
};

// TASKS ===========================================================================================
gulp.task("build", function() {
  return gulp.src("./src/**/*.js")
    .pipe(gulpJsx(jsxOptions))
    .pipe(gulp.dest("build"));
});

gulp.task("dist", function() {
  return gulp.src("./build/app.js")
    .pipe(through2.obj(function(file, enc, next) { // workaround for https://github.com/substack/node-browserify/issues/1044
      browserify(file.path)                        // see also https://github.com/babel/babelify/issues/46
        .transform(babelify)
        .bundle(function(err, res) {
          file.contents = res;
          next(null, file);
        });
    }))
    .pipe(gulp.dest("static/scripts"));
});

gulp.task("default", function() {
  runSequence("build", "dist");
});