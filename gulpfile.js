"use strict";

var gulp = require('gulp'),
	env = require('gulp-env'),
	jshint = require('gulp-jshint'),
	mocha = require('gulp-mocha');

gulp.task('scripts', function() {
	return gulp.src('**/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'));
});

gulp.task('set-env-test', function() {
	env({
		vars: {
			NODE_ENV: 'test'
		}
	});
});

gulp.task('test', ['set-env-test', 'scripts'], function() {
	return gulp.src('test/**/*.js', {
			read: false
		})
		// gulp-mocha needs filepaths so you can't have any plugins before it
		.pipe(mocha({
			reporter: 'spec'
		}));
});