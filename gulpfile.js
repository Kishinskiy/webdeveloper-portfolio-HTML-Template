const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const open = require("gulp-open");
const build = require('gulp-build');

const dist = "./docs";

// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "src"
        }
    });
});

gulp.task('styles', function(){
    return gulp.src("src/sass/**/*.+(scss|sass)")
            .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
            .pipe(rename({
                prefix: "",
                suffix: ".min",
            }))
            .pipe(autoprefixer())
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(gulp.dest("src/css"))
            .pipe(browserSync.stream());
});

gulp.task('watch', function(){
    gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel("styles"));
    gulp.watch("src/*.html").on("change", browserSync.reload);
});

gulp.task('build', gulp.parallel(
    function() {
    return gulp.src('src/*.html')
        .pipe(build({ GA_ID: '123456' }))
        .pipe(gulp.dest(dist))
},
function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({
        prefix: "",
        suffix: ".min",
    }))
    .pipe(autoprefixer())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest("docs/css"))
},
function (){
    return gulp.src('src/img/**/*.+(jpg|png|svg)')
    .pipe(gulp.dest('docs/img'))
},
function(){
    return gulp.src('src/*.js')
    .pipe(gulp.dest('docs/js'))
}
));

gulp.task('default', gulp.parallel('watch', 'server', 'styles'));
