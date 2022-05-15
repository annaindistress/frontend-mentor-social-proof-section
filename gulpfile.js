const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const del = require('del');
const ghpages = require('gh-pages');
const sync = require('browser-sync');

// Clean

gulp.task('clean', function () {
    return del('dist');
});

// Copy

gulp.task('copy', function () {
    return gulp
        .src([
            'src/*.html',
            'src/fonts/**/*',
            'src/images/**/*'
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
});

// Styles

gulp.task('styles', function () {
    return gulp
        .src('src/styles/style.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(gulp.dest('dist/styles'))
        .pipe(sync.stream());
});

// Server

gulp.task('server', function() {
    sync.init({
        ui: false,
        notify: false,
        server: {
            baseDir: 'dist'
        }
    });
});

// Watch

gulp.task('watch', function() {
    gulp.watch([
        'src/*.html',
        'src/fonts/**/*',
        'src/images/**/*'
    ], gulp.series('copy'));
    gulp.watch('src/styles/**/*.scss', gulp.series('styles'));
});

// Build

gulp.task('build', gulp.series(
    'clean',
    'copy',
    'styles'
));

// Push build to gh-pages

gulp.task('deploy', function () {
    return ghpages.publish('dist');
});

// Start

gulp.task('start', gulp.series(
    gulp.parallel('build'),
    gulp.parallel(
        'watch',
        'server'
    )
));
