var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var runSequence = require('run-sequence');
var del = require('del');

var gulpSequence = require('gulp-sequence');
var gfi = require("gulp-file-insert");
var gbr = require('gulp-batch-replace');
var merge = require('merge-stream');

var config = {
  src: {
    appJs:['app/js/*.js'],
    appLess: ['app/less/*.less'],
    appImgs: ['app/assets/images/**'],
    libsJs: [],
    libsCSS: [],
    libsFonts: ['app/assets/fonts/**'],
    htmlFiles: [ {'filename': 'index', 'locationname':'index.html'}],
    navigationLinks:[['{home}','index.html']],    
    htmlLocation: "app/templates/"
  },
  dest:{
    appJs:'public/js',
    appCSS:'public/css',
    appFonts:'public/fonts',
    appImgs: 'public/images',
    base: 'public'
  }
};

gulp.task('clean', function () {
  return del([config.dest.base+'/*']);
});
gulp.task('app-js', function(){
  // Bundle all JS files into one files
  return gulp.src(config.src.appJs)
      .pipe(concat('bundle.js'))
      .pipe(gulp.dest(config.dest.appJs));
});

gulp.task('app-less', function(){
  // Build all Less files into one min CSS
  return gulp.src(config.src.appLess)
      .pipe(concat('styles.min.css'))
      .pipe(less())
      .pipe(minifyCSS())
      .pipe(gulp.dest(config.dest.appCSS));
});

gulp.task('app-imgs', function(){
  // Move all images into one the public fonts folder
  return gulp.src(config.src.appImgs)
      .pipe(gulp.dest(config.dest.appImgs));
});

gulp.task('lib-js', function(){
  // Bundle all JS Library files into one files
  return gulp.src(config.src.libsJs)
      .pipe(concat('libs.min.js'))
      .pipe(gulp.dest(config.dest.appJs));
});
gulp.task('lib-css', function(){
  // Bundle all JS Library files into one files
  return gulp.src(config.src.libsCSS)
      .pipe(concat('libs.min.css'))
      .pipe(gulp.dest(config.dest.appCSS));
});

gulp.task('lib-fonts', function(){
  // Move all fonts files into one the public fonts folder
  return gulp.src(config.src.libsFonts)
      .pipe(gulp.dest(config.dest.appFonts));
});

gulp.task('build-html', function(){    
    var tasks = config.src.htmlFiles.map(function(fileObj){
      console.log("Building File: " + fileObj.filename);
      return gulp.src(config.src.htmlLocation + '/layout.html')
                /* Build each page with layout file */
                .pipe(gfi({"/* INSERT BODY */": config.src.htmlLocation + fileObj.locationname  }))
                .pipe(gfi({"/* INSERT LOGO */": 'app/assets/images/logo.svg'  }))
                /* Insert proper location into the page links */
                .pipe(gbr(config.src.navigationLinks))
                .pipe(rename(function(path){ path.basename = fileObj.filename; }))
                .pipe(gulp.dest(config.dest.base));      
    });
    
    return merge(tasks);
});
gulp.task('all', gulpSequence('clean', ['lib-fonts', 'lib-css', 'lib-js', 'app-imgs', 'app-js', 'app-less'], 'build-html'));