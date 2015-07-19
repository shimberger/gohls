
var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');


gulp.task('sass', function () {
	gulp.src('./sass/app.scss')
		.pipe(sass())
		.pipe(gulp.dest('./css/'));
});

gulp.task('babel', function () {
	gulp.src('./jsx/*.jsx')
		.pipe(babel())
		.pipe(gulp.dest('./js/'));
});

gulp.task('watch', ['default'], function() {
	gulp.watch('jsx/**/*.jsx', ['babel']);
	gulp.watch('sass/**/*.scss', ['sass']);

});

gulp.task('default',['sass','babel']);