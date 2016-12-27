
var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');

gulp.task('img', function() {
   gulp.src('./img/**/*')
   .pipe(gulp.dest('../build/img/'));
});

gulp.task('fonts', function() {
   gulp.src([
  		'node_modules/bootstrap/dist/fonts/**/*',
   	])
   .pipe(gulp.dest('../build/fonts/'));
});

gulp.task('sass', function () {
	gulp.src('./sass/app.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest('../build/css/'));
});

gulp.task('babel', function () {
	gulp.src('./jsx/*.jsx')
		.pipe(plumber())
		.pipe(babel({
            presets: ["react"]
        }))
		.pipe(gulp.dest('../build/js/'));
});

gulp.task('html', function () {
	gulp.src('./index.html')
		.pipe(gulp.dest('../build/'));
});

gulp.task('vendor:css', function() {
  return gulp.src([
  		'node_modules/bootstrap/dist/css/bootstrap.css',
  	])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('../build/css/'));
});



gulp.task('vendor:js', function() {
  return gulp.src([
  		'node_modules/babel-polyfill/dist/polyfill.min.js',
  		'node_modules/jquery/dist/jquery.min.js',
      'node_modules/video.js/dist/video.min.js',
      'node_modules/videojs-contrib-hls/dist/videojs-contrib-hls.min.js',
      'node_modules/moment/min/moment.min.js',
  		'node_modules/bootstrap/dist/css/bootstrap.min.js',
  		'node_modules/history/umd/history.min.js',
  		'node_modules/react/dist/react-with-addons.js',
  		'node_modules/react-dom/dist/react-dom.js',
  		'node_modules/react-router/umd/ReactRouter.min.js'
  	])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('../build/js/'));
});

gulp.task('vendor',['vendor:css','vendor:js']);


gulp.task('watch', ['default'], function() {
	gulp.watch('jsx/**/*.jsx', ['babel']);
	gulp.watch('img/**/*', ['img']);
	gulp.watch('sass/**/*.scss', ['sass']);
});

gulp.task('default',['sass','babel','img','html','vendor','fonts']);
