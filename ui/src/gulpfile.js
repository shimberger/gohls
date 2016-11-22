
var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');

gulp.task('img', function() {
   gulp.src('./img/**/*')
   .pipe(gulp.dest('../build/img/'));
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


gulp.task('watch', ['default'], function() {
	gulp.watch('jsx/**/*.jsx', ['babel']);
	gulp.watch('img/**/*', ['img']);
	gulp.watch('sass/**/*.scss', ['sass']);
});

gulp.task('default',['sass','babel','img','html']);
