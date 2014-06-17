// First line of any JS program
"use strict";

// Includes
var gulp = require("gulp");
var _ = require("underscore");
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var merge = require('merge-stream');

/*
* The JS source files to process.
*/
var testSource = gulp.src(["./test/*.js", "./test/**/*.js"]);
var appSource = gulp.src(["./lib/*.js", "./lib/**/*.js"]);
var jsSource = merge(testSource, appSource);

/*
* JSHint Tasks.
*/
var jsHintStream = appSource.pipe(jshint());
gulp.task('lint', function() {
  return jsHintStream.
    pipe(jshint.reporter('jshint-stylish')).
    pipe(jshint.reporter('fail'))
  ;
});

/*
* Testing tasks
*/
gulp.task('test', function() {
  return testSource.
    pipe(mocha({reporter:'spec'}));
});
