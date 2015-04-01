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

// BACKEND TASKS ===================================================================================
//Gulp.task("backend:lint", function() {
//  return Gulp.src(["./backend/**/*.js"])
//    .pipe(GulpPlumber({errorHandler: !exitOnError}))
//    .pipe(cached("backend:lint"))
//    .pipe(GulpJshint())
//    .pipe(GulpJshint.reporter(jshintStylish));
//});

Gulp.task("backend:nodemon", function() {
  let nodemon = ChildProcess.spawn("npm", ["run", "nodemon"]);
  nodemon.stdout.pipe(process.stdout);
  nodemon.stderr.pipe(process.stderr);
});

// FRONTEND TASKS ==================================================================================
// TODO sourcemaps
Gulp.task("frontend:build", function () {
  return Gulp.src("frontend/**/*.js")
    .pipe(GulpPlumber({errorHandler: !exitOnError}))
    .pipe(GulpCached("build"))
    .pipe(GulpJsx(jsxOptions))
    .pipe(Gulp.dest("build"));
});

Gulp.task("frontend:dist-styles", function() {
  return Gulp.src(["./frontend/**/theme.css"])
    .pipe(GulpPlumber({errorHandler: !exitOnError}))
    //.pipe(GulpLess())
    .pipe(Gulp.dest("./static/"));
});

//Gulp.task("frontend:lint", function() {
//  return Gulp.src(["./frontend/**/*.js"])
//    .pipe(GulpPlumber({errorHandler: !exitOnError}))
//    .pipe(cached("lint-react"))
//    .pipe(GulpJshint())
//    .pipe(GulpJshint.reporter(JshintStylish));
//});

Gulp.task("frontend:dist-images", function () {
  return Gulp.src(["./images/**/*"])
    .pipe(Gulp.dest("./static/images"));
});

Gulp.task("frontend:dist-vendors", function () {
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

function distFactory(appCode) { // , ["frontend:predist-app"]
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

function watchifyFactory(appCode) { // , ["frontend:predist-app"]
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
Gulp.task("frontend:dist-1.1", distFactory("1.1"));
Gulp.task("frontend:dist-1.2", distFactory("1.2"));
Gulp.task("frontend:dist-1.3", distFactory("1.3"));
Gulp.task("frontend:dist-2.1", distFactory("2.1"));
Gulp.task("frontend:dist-2.2", distFactory("2.2"));
Gulp.task("frontend:dist-3.1", distFactory("3.1"));
Gulp.task("frontend:dist-3.2", distFactory("3.2"));
Gulp.task("frontend:dist-3.3", distFactory("3.3"));
Gulp.task("frontend:dist-3.4", distFactory("3.4"));
Gulp.task("frontend:dist-4.1", distFactory("4.1"));
Gulp.task("frontend:dist-4.2", distFactory("4.2"));
Gulp.task("frontend:dist-4.3", distFactory("4.3"));
Gulp.task("frontend:dist-5.1", distFactory("5.1"));
Gulp.task("frontend:dist-6.1", distFactory("6.1"));
Gulp.task("frontend:dist-6.2", distFactory("6.2"));

Gulp.task("frontend:watchify-1.1", watchifyFactory("1.1"));
Gulp.task("frontend:watchify-1.2", watchifyFactory("1.2"));
Gulp.task("frontend:watchify-1.3", watchifyFactory("1.3"));
Gulp.task("frontend:watchify-2.1", watchifyFactory("2.1"));
Gulp.task("frontend:watchify-2.2", watchifyFactory("2.2"));
Gulp.task("frontend:watchify-3.1", watchifyFactory("3.1"));
Gulp.task("frontend:watchify-3.2", watchifyFactory("3.2"));
Gulp.task("frontend:watchify-3.3", watchifyFactory("3.3"));
Gulp.task("frontend:watchify-3.4", watchifyFactory("3.4"));
Gulp.task("frontend:watchify-4.1", watchifyFactory("4.1"));
Gulp.task("frontend:watchify-4.2", watchifyFactory("4.2"));
Gulp.task("frontend:watchify-4.3", watchifyFactory("4.3"));
Gulp.task("frontend:watchify-5.1", watchifyFactory("5.1"));
Gulp.task("frontend:watchify-6.1", watchifyFactory("6.1"));
Gulp.task("frontend:watchify-6.2", watchifyFactory("6.2"));

Gulp.task("frontend:dist-scripts", function() {
  RunSequence(
    "frontend:dist-1.1", "frontend:dist-1.2", "frontend:dist-1.3",
    "frontend:dist-2.1", "frontend:dist-2.2",
    "frontend:dist-3.1", "frontend:dist-3.2", "frontend:dist-3.3", "frontend:dist-3.4",
    "frontend:dist-4.1", "frontend:dist-4.2", "frontend:dist-4.3",
    "frontend:dist-5.1",
    "frontend:dist-6.1", "frontend:dist-6.2"
  )
});

Gulp.task("frontend:watchify", function () {
  RunSequence(
    "frontend:watchify-1.1", "frontend:watchify-1.2", "frontend:watchify-1.3",
    "frontend:watchify-2.1", "frontend:watchify-2.2",
    "frontend:watchify-3.1", "frontend:watchify-3.2", "frontend:watchify-3.3", "frontend:watchify-3.4",
    "frontend:watchify-4.1", "frontend:watchify-4.2", "frontend:watchify-4.3",
    "frontend:watchify-5.1",
    "frontend:watchify-6.1", "frontend:watchify-6.2"
  )
});

Gulp.task("frontend:dist", [
  "frontend:dist-scripts",
  "frontend:dist-images",
  "frontend:dist-styles",
]);

Gulp.task("frontend:watch", function () {
  Gulp.watch("./frontend/**/*.js", ["frontend:build"]);
  Gulp.watch("./frontend/**/*.(jpg|png|gif)", ["frontend:dist-images"]);
  Gulp.watch("./frontend/**/*.css", ["frontend:dist-styles"]);
});

// TASK DEPS =======================================================================================
Gulp.task("default", function () {
  return RunSequence(
    ["frontend:build"],
    ["backend:nodemon", "frontend:dist"],
    ["frontend:watch", "frontend:watchify"]
  );
});

Gulp.task("devel", function () {
  return RunSequence(
    ["frontend:dist-vendors", "frontend:dist"],
    "default"
  );
});