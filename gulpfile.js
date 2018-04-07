var gulp = require('gulp');
var uglify = require('gulp-uglify');//壓縮js
var pump = require('pump'); //gulp-unglify 依賴套件
var jshint = require('gulp-jshint'); //檢查 javascript 是否有錯誤
var htmlmin = require('gulp-htmlmin');//壓縮html
var del = require('del'); //刪除指定資料夾
var concat = require('gulp-concat'); // 合併檔案
var sass = require('gulp-sass'); //編譯成css
var browserSync = require('browser-sync').create();

gulp.task('default', function() {
  console.log("hello gulp ~!")
});


gulp.task('compress', function (cb) { //壓縮js來源
  pump([
        gulp.src('./script/*.js'),
        uglify(),
        gulp.dest('./dist/js')  //壓縮完放置目錄dist位置
    ],
    cb
  );
});


gulp.task('lint', function() { //檢查js error
  return gulp.src('./script/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish')); //jshint-stylish美化格式
});

gulp.task('minify', function() { //壓縮html
  return gulp.src('./html/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/html'));
});


gulp.task('clean', function () { //刪除指定文件，通常我們在建立自動化 task 之前，都會先執行清空資料夾
  return del(['./dist']);
});

gulp.task('concat', function() { //好處為之後載入all.js，不用一直link，可用於套件管理
  return gulp.src('./script/*.js')
    .pipe(concat('all.js'))
    // .pipe(uglify())  //壓縮js
    .pipe(gulp.dest('./dist/concat/js'));
});

// gulp.task('sass', function () { // scss -> css
//   return gulp.src('scss/*.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('./dist/css'));
// });

var vendorjs = [
  'bower_components\jquery\dist\jquery.min.js' ,
  'bower_components\angular\angular.min.js'
]
gulp.task('vendor', function() { //gulp與bower結合運用
  return gulp.src(vendorjs)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/concat/vendor'));
});


// Static Server + watching scss/html files，只需啟動gulp serve會連同 gulp sass 一併啟動
gulp.task('serve', ['sass'], function() {
  browserSync.init({
      server: "./"
  });
  gulp.watch("./scss/*.scss", ['sass']);
  gulp.watch("./*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("./scss/*.scss")
      .pipe(sass())
      .pipe(gulp.dest("dist/css"))
      .pipe(browserSync.stream());
});

gulp.task('default', ["clean", "compress", "minify", "concat", "vendor", "serve"]);
//一次執行gulp


