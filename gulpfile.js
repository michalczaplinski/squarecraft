var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-ruby-sass'),
  babel = require("gulp-babel");


gulp.task('sass', function () {
  return sass('./public/css/**/*.scss')
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./public/css/*.scss', ['sass']);
  gulp.watch('./public/src/*.js', ['js']);
});

gulp.task('develop', function () {
  nodemon({
    script: 'server/game.js',
    ext: 'js coffee',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task("js", function () {
  return gulp.src("./public/src/*.js")
    .pipe(babel())
    .pipe(gulp.dest("./public/js"))
    .pipe(livereload());
});

gulp.task('default', [
  'sass',
  'js',
  'develop',
  'watch'
]);
