var gulp = require('gulp');
var git = require('gulp-git');
var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var replace = require('gulp-replace');

gulp.task('x_bump', function(){
    gulp.src('./package.json')
        .pipe(bump({type:'PATCH', indent: 4 }))
        .pipe(gulp.dest('./'));
});

gulp.task('cssDev', function(){
    gulp.src(['src/styles/style.css'])
        .pipe(replace(/\/\*\*dev_mode_start\*\*\/[^]+\/\*\*dev_mode_end\*\*\//gim, cssDev))
        .pipe(gulp.dest('src/styles/'));
});

gulp.task('cssRelease', function(){
    gulp.src(['src/styles/style.css'])
        .pipe(replace(/\/\*\*dev_mode_start\*\*\/[^]+\/\*\*dev_mode_end\*\*\//gim, cssRelease))
        .pipe(gulp.dest('src/styles/'));
});


/** Dangerous, this will wipe your current source and sync with GitHub **/
gulp.task('vanish***', function (done) {
    var c = 8;
    console.log('Starting in ' + c + '  seconds');
    var handler = setInterval(function () {
        c--;
        console.log('syncing in ---> ' + c);
        if (c == 0) {
            clearInterval(handler);
            console.log('sync');
            runSequence('x_gitReset', 'x_gitPull', done);
        }
    }, 1000)
});

gulp.task('x_gitPull', function () {
    git.exec({args: '-c core.quotepath=false pull --progress --no-stat -v --progress origin master'}, function (err, stdout) {
        if (err) throw err;
    });
});

gulp.task('x_gitReset', function () {
    git.exec({args: '-c core.quotepath=false reset --hard HEAD --'}, function (err, stdout) {
        if (err) throw err;
    });
});


var cssRelease = `/**dev_mode_start**/
small.debug {
    color: red;
    display: none !important;
}

small.release {
    text-transform: lowercase;
    color: #4c4c4c;
}
/**dev_mode_end**/`;

var cssDev = `/**dev_mode_start**/
small.debug {
    color: red;
}

small.release {
    text-transform: lowercase;
    color: #4c4c4c;
    display: none !important;
}
/**dev_mode_end**/`;