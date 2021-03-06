import gulp from 'gulp';
import del from 'del';

gulp.task('clean:js', () => del([
    './.build/legacy/*.js',
    './.build/legacy/*.js.map',
], {
    force: true,
}));

gulp.task('clean:css', () => del([
    './.build/legacy/*.css',
    './.build/legacy/*.css.map',
], {
    force: true,
}));

gulp.task('clean:all', () => del([
    './.build/**/*',
], {
    force: true,
}));

gulp.task('clean', [ 'clean:js', 'clean:css' ]);
