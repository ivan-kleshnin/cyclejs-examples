// ENV =============================================================================================
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || "./shared/config";

// IMPORTS =========================================================================================
let Path = require("path");
let Glob = require("glob");
let ChildProcess = require("child_process");
let Mkdirp = require("mkdirp");
let Config = require("config");
let RunSequence = require("run-sequence");
let Gulp = require("gulp");
let JshintStylish = require("jshint-stylish");
let GulpJshint = require("gulp-jshint");
let GulpCached = require("gulp-cached");
let GulpJsx = require("gulp-jsx");
let GulpSourcemaps = require("gulp-sourcemaps");
let GulpLess = require("gulp-less");
let GulpPlumber = require("gulp-plumber");
let frontendVendors = require("./package.json").frontendVendors;

// OPTIONS =========================================================================================
let exitOnError = false;

let jsxOptions = {
  ignoreDocblock: true,
  docblockUnknownTags: true,
  unknownTagsAsString: true,
  jsx: "h",
  renameAttrs: {
    "for": "htmlFor",
    "class": "className",
  }
};

require("events").EventEmitter.defaultMaxListeners = 999;

// HELPERS =========================================================================================
function interleaveWith(array, prefix) {
  return array.reduce((memo, val) => {
    return memo.concat([prefix]).concat([val]);
  }, []);
}

// TASKS ===========================================================================================
// TODO sourcemaps
Gulp.task("build", function () {
  return Gulp.src("frontend/**/*.js")
    .pipe(GulpPlumber({errorHandler: !exitOnError}))
    .pipe(GulpCached("build"))
    .pipe(GulpJsx(jsxOptions))
    .pipe(Gulp.dest("build"));
});

Gulp.task("dist-styles", function () {
  return Gulp.src(["./frontend/**/theme.css"])
    .pipe(GulpPlumber({errorHandler: !exitOnError}))
    //.pipe(GulpLess())
    .pipe(Gulp.dest("./static/"));
});

//Gulp.task("lint", function () {
//  return Gulp.src(["./frontend/**/*.js"])
//    .pipe(GulpPlumber({errorHandler: !exitOnError}))
//    .pipe(cached("lint-react"))
//    .pipe(GulpJshint())
//    .pipe(GulpJshint.reporter(JshintStylish));
//});

Gulp.task("dist-images", function () {
  return Gulp.src(["./images/**/*"])
    .pipe(Gulp.dest("./static/images"));
});

Gulp.task("dist-vendors", function () {
  // $ browserify -d -r cyclejs [-r ...] -o ./static/scripts/vendors.js
  Mkdirp.sync("./static/common/scripts");

  let args = ["-d"]
    .concat(interleaveWith(frontendVendors, "-r"))
    .concat(["-o", "./static/common/scripts/vendors.js"]);

  let bundler = ChildProcess.spawn("browserify", args);
  bundler.stdout.pipe(process.stdout);
  bundler.stderr.pipe(process.stderr);
  bundler.on("exit", function (code) {
    if (exitOnError && code) {
      process.exit(code);
    }
  });
});

function distFactory(appCode) { // , ["predist-app"]
  return function dist() {
    let folders = Glob.sync(`build/${appCode}*`);
    if (!folders) {
      throw Error(`wrong app code ${appCode}`);
    }

    let appName = Path.basename(folders[0]);

    Mkdirp.sync(`static/${appName}/scripts`);

    // $ browserify --delay 0 -d -x cyclejs [-x ...] ./build/{app}/scripts/app.js -o ./static/{app}/scripts/app.js
    let args = ["-d", "--delay 0"]
      .concat(interleaveWith(frontendVendors, "-x"))
      .concat([`./build/${appName}/scripts/app.js`])
      .concat(["-o", `./static/${appName}/scripts/app.js`]);

    let bundler = ChildProcess.spawn("browserify", args);
    bundler.stdout.pipe(process.stdout);
    bundler.stderr.pipe(process.stderr);
    bundler.on("exit", function (code) {
      if (exitOnError && code) {
        process.exit(code);
      }
    });
  }
}

function watchifyFactory(appCode) { // , ["predist-app"]
  return function dist() {
    let folders = Glob.sync(`build/${appCode}*`);
    if (!folders) {
      throw Error(`wrong app code ${appCode}`);
    }

    let appName = Path.basename(folders[0]);

    Mkdirp.sync(`static/${appName}/scripts`);

    // $ watchify --delay 0 -v -d -x cycle [-x ...] ./build/{app}/scripts/app.js -o ./static/{app}/scripts/app.js
    let args = ["-v", "-d", "--delay 0"]
      .concat(interleaveWith(frontendVendors, "-x"))
      .concat([`./build/${appName}/scripts/app.js`])
      .concat(["-o", `./static/${appName}/scripts/app.js`]);

    let watcher = ChildProcess.spawn("watchify", args);
    watcher.stdout.pipe(process.stdout);
    watcher.stderr.pipe(process.stderr);
  }
}

// All this mess is required because of dumb Gulp v3 architecture. TODO: reconsider at Gulp v4 release (undocumented yet!)
Gulp.task("dist-1.1", distFactory("1.1"));
Gulp.task("dist-1.2", distFactory("1.2"));
Gulp.task("dist-1.3", distFactory("1.3"));
Gulp.task("dist-2.1", distFactory("2.1"));
Gulp.task("dist-2.2", distFactory("2.2"));
Gulp.task("dist-3.1", distFactory("3.1"));
Gulp.task("dist-3.2", distFactory("3.2"));
Gulp.task("dist-3.3", distFactory("3.3"));
Gulp.task("dist-3.4", distFactory("3.4"));
Gulp.task("dist-4.1", distFactory("4.1"));
Gulp.task("dist-4.2", distFactory("4.2"));
Gulp.task("dist-4.3", distFactory("4.3"));
Gulp.task("dist-5.1", distFactory("5.1"));
Gulp.task("dist-6.1", distFactory("6.1"));
Gulp.task("dist-6.2", distFactory("6.2"));

Gulp.task("watchify-1.1", watchifyFactory("1.1"));
Gulp.task("watchify-1.2", watchifyFactory("1.2"));
Gulp.task("watchify-1.3", watchifyFactory("1.3"));
Gulp.task("watchify-2.1", watchifyFactory("2.1"));
Gulp.task("watchify-2.2", watchifyFactory("2.2"));
Gulp.task("watchify-3.1", watchifyFactory("3.1"));
Gulp.task("watchify-3.2", watchifyFactory("3.2"));
Gulp.task("watchify-3.3", watchifyFactory("3.3"));
Gulp.task("watchify-3.4", watchifyFactory("3.4"));
Gulp.task("watchify-4.1", watchifyFactory("4.1"));
Gulp.task("watchify-4.2", watchifyFactory("4.2"));
Gulp.task("watchify-4.3", watchifyFactory("4.3"));
Gulp.task("watchify-5.1", watchifyFactory("5.1"));
Gulp.task("watchify-6.1", watchifyFactory("6.1"));
Gulp.task("watchify-6.2", watchifyFactory("6.2"));

Gulp.task("dist-scripts", function () {
  RunSequence(
    "dist-1.1", "dist-1.2"//, "dist-1.3",
    //"dist-2.1", "dist-2.2",
    //"dist-3.1", "dist-3.2", "dist-3.3", "dist-3.4",
    //"dist-4.1", "dist-4.2", "dist-4.3",
    //"dist-5.1",
    //"dist-6.1", "dist-6.2"
  )
});

Gulp.task("watch-build", function () {
  RunSequence(
    "watchify-1.1", "watchify-1.2"//, "watchify-1.3",
    //"watchify-2.1", "watchify-2.2",
    //"watchify-3.1", "watchify-3.2", "watchify-3.3", "watchify-3.4",
    //"watchify-4.1", "watchify-4.2", "watchify-4.3",
    //"watchify-5.1",
    //"watchify-6.1", "watchify-6.2"
  )
});

Gulp.task("watch-src", function () {
  Gulp.watch("./frontend/**/*.js", ["build"]);
  Gulp.watch("./frontend/**/*.(jpg|png|gif)", ["dist-images"]);
  Gulp.watch("./frontend/**/*.css", ["dist-styles"]);
});

Gulp.task("dist", function () {
  exitOnError = true;
  return RunSequence(
    ["build"],
    ["dist-scripts", "dist-images", "dist-styles", "dist-vendors"]
  );
});

Gulp.task("watch", ["watch-src", "watch-build"]);