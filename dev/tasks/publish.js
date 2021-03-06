import gulp from 'gulp';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import sequence from 'gulp-sequence';
import commit from 'gulp-gh-pages';

const DEVELOPMENT = gutil.env.dev;

gulp.task('publish:commit', () => {
    return gulp.src([
        './.build/**/*',
        './docs/**/*',
    ])
        .pipe(plumber())
        .pipe(commit({
            push: DEVELOPMENT,
        }));
});

gulp.task('publish', [ 'lint:v1:js', 'lint:v2:js' ], sequence('clean:all', 'build', 'webpack', 'publish:commit'));
