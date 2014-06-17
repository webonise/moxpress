// First line of any JS program
"use strict";

// Includes
var gulp = require("gulp");
var _ = require("underscore");
var mocha = require('gulp-mocha');
var merge = require('merge-stream');

/*
* The JS source files to process.
*/
var testSource = gulp.src(["./test/*.js", "./test/**/*.js"]);
var appSource = gulp.src(["./lib/*.js", "./lib/**/*.js"]);
var jsSource = merge(testSource, appSource);

/*
* Testing tasks
*/
gulp.task('test', function() {
  return testSource.
    pipe(mocha({reporter:'spec'}));
});
