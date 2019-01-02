// Grab our gulp packages
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    buffer = require('vinyl-buffer'),
    tsc = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    uglify = require('gulp-uglify');

var pckg = require('./package.json');
// console.log(pckg);
var tsProject = tsc.createProject('tsconfig.json');

function swallowError(error) {
    // If you want details of the error in the console
    console.log(error.toString())
    this.emit('end')
}

/////////////////////////////////////////////////////////////////////////////////
//                                VARIABLES                                    //
/////////////////////////////////////////////////////////////////////////////////
var names = {
    mainDistFile: 'core',
    mainSourceFile: 'main',
    mainFwDistFile: 'mon-chan',
    mainFwSourceFile: 'Mon-chan'
};

var paths = {
    scripts: {
        sourceTS: [
            'source/**/*.ts',
            'source/typings/**.d.ts/',
            'source/interfaces/interfaces.d.ts'
        ],
        sourceJS: './js/processed/',
        dist: './dist/',
        dev: './dev/'
    },
    libs: [
        'node_modules/box2dweb/box2d.js',
        'node_modules/pixi.js/dist/pixi.js'
    ]
};

/////////////////////////////////////////////////////////////////////////////////
//                                   LIBS                                      //
/////////////////////////////////////////////////////////////////////////////////
gulp.task('bundle:libs', function () {
    gulp.src(paths.libs)
        .pipe(sourcemaps.init())
        .pipe(concat('libs.js'))
        .pipe(gulp.dest(paths.scripts.sourceJS))
        .pipe(rename('libs.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scripts.dev)
        );
});

/////////////////////////////////////////////////////////////////////////////////
//                                   CORE                                      //
/////////////////////////////////////////////////////////////////////////////////
gulp.task('bundle:core', function () {
    var bundler = browserify({
        debug: true,
        standalone: names.mainDistFile
    });
    return gulp.src(paths.scripts.sourceTS)
        .pipe(tsProject())
        .on('error', swallowError)
        .js.pipe(gulp.dest(paths.scripts.sourceJS).on('end', function () {
            bundler.add(paths.scripts.sourceJS + names.mainSourceFile + '.js')
                .bundle()
                .pipe(source(names.mainDistFile + '.min.js'))
                .pipe(buffer())
                .pipe(sourcemaps.init({ loadMaps: true }))
                .pipe(uglify())
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(paths.scripts.dev));
        }));
});

gulp.task('watch:core', function () {
    gulp.watch(paths.scripts.sourceTS, ['bundle:core']);

    gulp.watch("dev/core.min.js").on('change', function () {
        notify({
            title: pckg.name,
            message: 'By ' + pckg.author + '\nThanks for coming ♥' + '\nversion: ' + pckg.version
        }).write('');
    });
});

/////////////////////////////////////////////////////////////////////////////////
//                                FRAMEWORK                                    //
/////////////////////////////////////////////////////////////////////////////////
gulp.task('bundle:fw', function () {
    var bundler = browserify({
        debug: true,
        standalone: names.mainFwDistFile
    });
    return gulp.src(paths.scripts.sourceTS)
        .pipe(tsProject())
        .on('error', swallowError)
        .js.pipe(gulp.dest(paths.scripts.sourceJS).on('end', function () {
            bundler.add(paths.scripts.sourceJS + names.mainFwSourceFile + '.js')
                .bundle()
                .pipe(source(names.mainFwDistFile + '.min.js'))
                .pipe(buffer())
                .pipe(sourcemaps.init({ loadMaps: true }))
                .pipe(uglify())
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(paths.scripts.dist));
        }));
});