var gulp = require('gulp');
var del = require('del');
var Dgeni = require('dgeni');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('./docs/tsconfig.json');

const docsDistFolder = `./docs/dist`;
const docsBuildFolder = `./docs/build`;

gulp.task('clean-docs', function(){
  return del(`${docsBuildFolder}/**`, {force:true});
});

gulp.task('clean-docs-dist', function(){
  return del(`${docsDistFolder}/**`, {force:true});
});

gulp.task('ts-compile-docs', function () {
  return tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(gulp.dest(`${docsDistFolder}`));
});

gulp.task('copy-templates', function() {
  return gulp.src(['./docs/src/templates/**/*'])
  .pipe(gulp.dest(`${docsDistFolder}/templates`));
});

gulp.task('run-dgeni', function() {
  try {
    var dgeni = new Dgeni([require(`${docsDistFolder}/index`)]);
    return dgeni.generate();
  } catch(x) {
    console.log(x.stack);
    throw x;
  }
});

gulp.task('clean-docs', gulp.parallel('clean-docs-dist', 'clean-docs'))
gulp.task('compile-docs', gulp.parallel('ts-compile-docs', 'copy-templates'));
gulp.task('build-docs', gulp.series('clean-docs', 'compile-docs', 'run-dgeni'));