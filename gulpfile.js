var gulp = require('gulp');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var jsmin = require('gulp-uglifyjs');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var copy = require('gulp-copy');
var order = require('gulp-order');
var es = require('event-stream');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var htmlreplace = require('gulp-html-replace');
var jshint = require('gulp-jshint');

var path = {
    "allJs": ['./src/js/internetpate.js', './src/js/**/*.js'],
    "vendorJs": [ // all files will concat to vendor.min.js file
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/bootstrap/dist/js/bootstrap.min.js',
        './bower_components/js-sha256/build/sha256.min.js',
        './bower_components/pickadate/lib/compressed/picker.js',
        './bower_components/pickadate/lib/compressed/picker.date.js',
        './bower_components/pickadate/lib/compressed/picker.time.js',
        './bower_components/pickadate/lib/compressed/translations/de_DE.js',
        './bower_components/angular/angular.min.js',
        './bower_components/angular-sanitize/angular-sanitize.min.js',
        './bower_components/angular-route/angular-route.min.js',
        './bower_components/tv4/tv4.js',
        './bower_components/tinymce/tinymce.min.js',
        './bower_components/tx-tinymce/tx-tinymce.min.js',
        './bower_components/objectpath/lib/ObjectPath.js',
        './bower_components/ng-file-upload/ng-file-upload-all.min.js',
        './bower_components/angular-ui-notification/dist/angular-ui-notification.min.js',
        './bower_components/angular-schema-form/dist/schema-form.min.js',
        './bower_components/angular-schema-form/dist/bootstrap-decorator.min.js',
        './bower_components/angular-schema-form-datepicker/bootstrap-datepicker.js',
        './bower_components/angular-schema-form-tinymce/bootstrap-tinymce.js'
    ],
    "outputJs": "json-cms.min.js",
    "outputJsVendor": "vendor.min.js",
    "outputJsPath": "./dist/js/",

    "allCss": ['./src/style/css/json-cms.css'],
    "vendorCss": [ // all files will concat to vendor.min.css file
        './bower_components/pickadate/lib/compressed/themes/default.css',
        './bower_components/pickadate/lib/compressed/themes/default.date.css',
        './bower_components/pickadate/lib/compressed/themes/default.time.css',
        './bower_components/angular-ui-notification/dist/angular-ui-notification.min.css',
        './bower_components/bootstrap/dist/css/bootstrap.min.css',
        './bower_components/bootswatch/paper/bootstrap.min.css'
    ],
    "outputCss": "json-cms.min.css",
    "outputCssVendor": "vendor.min.css",
    "outputCssPath": "./dist/css/"
};

gulp.task('vendorDependency', function () {
    return gulp.src('./bower_components/bootstrap/fonts/**/*').pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('jsMin', function () {
    return gulp.src(path.allJs)
        .pipe(jshint({ esversion: 6 }))
        .pipe(jshint.reporter('default'))
        .pipe(concat(path.outputJs))
        .pipe(babel())
        .pipe(jsmin())
        .pipe(gulp.dest(path.outputJsPath));
});

gulp.task('cssMin', function () {
    return gulp.src(path.allCss)
        .pipe(concat(path.outputCss))
        .pipe(cssmin())
        .pipe(gulp.dest(path.outputCssPath));
});

gulp.task('createVendor', ['vendorDependency'], function () {
    gulp.src(path.vendorJs)
        .pipe(concat(path.outputJsVendor))
        .pipe(gulp.dest(path.outputJsPath));

    return gulp.src(path.vendorCss)
        .pipe(concat(path.outputCssVendor))
        .pipe(gulp.dest(path.outputCssPath))
});

gulp.task('clear', function () {
    return gulp.src('./dist', { read: false })
        .pipe(clean());
});

gulp.task('dist', ['createVendor', 'jsMin', 'sass', 'cssMin', 'vendorDependency', 'copyIndex', 'copyRestful', 'copyTinymcefiles'], function () {
    gulp.src('./src/restful/**/*')
        .pipe(gulp.dest('./dist/restful'));

    gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./dist/img'));

    gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'));

    gulp.src('./src/.*')
        .pipe(gulp.dest('./dist/'));

    gulp.src(['src/*.json', 'src/*.php'])
        .pipe(gulp.dest('./dist/'));

    gulp.src('./src/partials/**/*')
        .pipe(gulp.dest('./dist/partials/'));

    gulp.dest('./dist/uploads/');

    gulp.src([path.outputJsPath + path.outputJs, path.outputJsPath + path.outputJsVendor])
        .pipe(gulp.dest('./dist/js/'));

    return gulp.src([path.outputCssPath + path.outputCss, path.outputCssPath + path.outputCssVendor])
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('copyIndex', function () {
    return gulp.src('./src/index.html').pipe(htmlreplace({
        'css': ['css/vendor.min.css', 'css/json-cms.min.css'],
        'js': ['js/vendor.min.js', 'js/json-cms.min.js']
    })).pipe(gulp.dest('./dist/'));
});

gulp.task('copyJsonfiles', function () {
    return gulp.src(['src/*.json']).pipe(gulp.dest('./dist/'));
});

gulp.task('copyRestful', function () {
    return gulp.src(['src/restful/**/*']).pipe(gulp.dest('./dist/restful/'));
});

gulp.task('copyTinymcefiles', function () {
    gulp.src(['./bower_components/tinymce/plugins/**/*']).pipe(gulp.dest('./dist/js/plugins/'));
    gulp.src(['./bower_components/tinymce/skins/**/*']).pipe(gulp.dest('./dist/js/skins/'));
    return gulp.src(['./bower_components/tinymce/themes/**/*']).pipe(gulp.dest('./dist/js/themes/'));
});

gulp.task('sass', function () {
    return gulp.src('./src/style/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./src/style/css'));
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['jsMin']);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('src/**/*.css', ['cssMin']);
    gulp.watch('src/index.html', ['copyIndex']);
    gulp.watch(['src/backend/*.json', 'src/backend/*.php'], ['copyBackend']);
});