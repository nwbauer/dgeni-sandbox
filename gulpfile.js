var gulp = require('gulp');
var Dgeni = require('dgeni');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('./docs/tsconfig.json');

gulp.task('ts-compile-docs', function () {
  return tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(gulp.dest('./docs/dist'));
});

gulp.task('copy-templates', function() {
  return gulp.src(['./docs/src/templates/**/*'])
  .pipe(gulp.dest('./docs/dist/templates'));
});

gulp.task('run-dgeni', function() {
  try {
    var dgeni = new Dgeni([require('./docs/dist/index')]);
    return dgeni.generate();
  } catch(x) {
    console.log(x.stack);
    throw x;
  }
});

gulp.task('compile-docs', gulp.parallel('ts-compile-docs', 'copy-templates'));
gulp.task('build-docs', gulp.series('compile-docs', 'run-dgeni'));