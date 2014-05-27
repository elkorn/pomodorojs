var gulp = require("gulp");
var mocha = require("gulp-mocha");
var watch = require("gulp-watch");
var grep = require("gulp-grep-stream");

var paths = {
    scripts: ['src/js/**/*.js', 'test/**/*.js']
};

gulp.task("default", function() {
    gulp.src(paths.scripts)
        .pipe(mocha({
            reporter: "dot"
        })).on('error', function(err) {
            if (!/tests? failed/.test(err.stack)) {
                console.log(err.stack);
            }
        });
    // .pipe(watch({
    //     emit: 'all'
    // }, function(files) {
    //     files
    //         .pipe(grep('test/**/*.js'))
    //         .pipe(mocha({
    //             reporter: "dot"
    //         }))
    //         .on('error', function() {
    //             if (!/tests? failed/.test(err.stack)) {
    //                 console.log(err.stack);
    //             }
    //         });
    // }));
});