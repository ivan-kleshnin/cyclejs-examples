// IMPORTS =========================================================================================
var ChildProcess = require("child_process");
var Glob = require("glob");
var Gulp = require("gulp");

// TASKS ===========================================================================================
Gulp.task("gulp", function() {
  Glob.sync("examples/*/", {ignore: "examples/common/"}).forEach(function(exampleDir) {
    ChildProcess.exec("cp examples/common/gulpfile.js " + exampleDir, function(err, stdin, stdout) {
      if (err) { throw err; }
    });
    //ChildProcess.exec("cp examples/common/.bowerrc " + exampleDir, function(err, stdin, stdout) {
    //  if (err) { throw err; }
    //});
    //ChildProcess.exec("cp examples/common/bower.json " + exampleDir, function(err, stdin, stdout) {
    //  if (err) { throw err; }
    //});
  });
});

Gulp.task("fix", function() {
  ChildProcess.exec("bin/fixes/globule", function(err, stdin, stdout) {
    if (err) { throw err; }
  });
});