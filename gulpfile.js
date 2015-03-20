// IMPORTS =========================================================================================
var Path = require("path");
var ChildProcess = require("child_process");
var Glob = require("glob");
var Gulp = require("gulp");

// SETTINGS ========================================================================================
var apps = Glob.sync("./src/*/").map(function(path) { return Path.basename(path); });

// TASKS ===========================================================================================
//Gulp.task("gulp", function() {
//  Glob.sync("examples/*/", {ignore: "examples/common/"}).forEach(function(exampleDir) {
//    ChildProcess.exec("cp examples/common/gulpfile.js " + exampleDir, function(err, stdin, stdout) {
//      if (err) { throw err; }
//    });
//  });
//});