var gulp = require('gulp'); // gulpを読み込む
var gutil = require('gulp-util');
var ghelper = require('gulp-helper');
var ip = require('ip');
ghelper.require();

var SCRIPTS = `
pixiutil
pixirenderer
pixitexture
pixielement
pixiscene
pixisprite
pixilabel
pixiapp
`.split('\n').filter(script=>!!script.trim()).map(function(script){
  return './src/' + script.trim() + '.js';
});

var pkg = require('./package.json');


gulp.task('prebuild', (callback) => {
  
  gulp.src(SCRIPTS)
    .pipe(concat('./phina.pixi.js'))
    .pipe(gulp.dest('./'));

  gulp.src(SCRIPTS)
    .pipe(concat('./phina.pixi.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./'))
    .on('end', function() {
    // callbackを実行してgulpにタスク完了を通知
    callback&&callback();
  });

});

gulp.task('build', ['prebuild'], () => {
  
  gulp.src(['./header.js', './phina.pixi.js'])
    .pipe(concat('./phina.pixi.js'))
    .pipe(replace('<%= VERSION %>', pkg.version))
    .pipe(gulp.dest('./'));

  gulp.src(['./header.js', './phina.pixi.min.js'])
    .pipe(concat('./phina.pixi.min.js'))
    .pipe(replace('<%= VERSION %>', pkg.version))
    .pipe(gulp.dest('./'));

});


gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      host: ip.address(),
      // livereload: true,
      // port: 9000,
      directoryListing: true,
      open: 'test/index.html',
    }));
});

gulp.task('watch', ['build', 'webserver'], function() {
  gulp.watch(['./src/*'], ['build']);
});

gulp.task('default', ['watch']);