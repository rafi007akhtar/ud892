/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable quotes */
/* eslint-disable no-tabs */
/* eslint-disable indent */
const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const eslint = require("gulp-eslint");
const jasmineBrowser = require("gulp-jasmine-browser");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

gulp.task("styles", function(done) {
	gulp
		.src("sass/**/*.scss")
		.pipe(sass().on("error", sass.logError))
		// .pipe(sass({outputStyle: "compressed"})) // for concatenation
		.pipe(autoprefixer({
			Browserslist: ["last 3 versions"],
		}))
		.pipe(gulp.dest("dist/css"))
		.pipe(browserSync.stream());
	done();
});

gulp.task("lint", function() {
	return (
		gulp
			.src(["js/**/*.js"])
			// eslint() attaches the lint output to the eslint property
            // of the file object so it can be used by other modules.
			.pipe(eslint())
			// eslint.format() outputs the lint results to the console.
			.pipe(eslint.format())
			// To have the process exit with an error code (1) on
			// lint error, return the stream and pipe to failOnError last.
			.pipe(eslint.failOnError())
	);
});

// gulp.task("tests", function() {
// 	return gulp
// 		.src("tests/spec/extraSpec.js")
// 		.pipe(jasmineBrowser.specRunner({console: true}))
// 		.pipe(jasmineBrowser.headless({driver: "chrome"}));
// }); // use this code for headless testing

gulp.task('tests', function() {
    gulp
        .src('tests/spec/extraSpec.js')
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({port: 3001}));
}); // use this code for running on browser

gulp.task("copy-html", function(done) {
	gulp.src("./index.html")
		.pipe(gulp.dest("./dist"));
	done();
});
gulp.task("copy-images", function(done) {
	gulp.src("img/*")
		.pipe(gulp.dest("./dist"));
	done();
});

gulp.task("scripts", function(done) {
	gulp.src("js/**/*.js")
		.pipe(concat("all.js"))
		.pipe(gulp.dest("dist/js"));
	done();
});
gulp.task("scripts-dist", function(done) {
	gulp.src("js/**/*.js")
		.pipe(concat("all.js"))
		.pipe(uglify())
		.pipe(gulp.dest("dist/js"));
	done();
});

gulp.task("dist", gulp.series(
	"copy-html",
	"copy-images",
	"styles",
	"lint",
	"scripts-dist"
	)
);

gulp.task("default", gulp.series("styles", "lint", function(done) {
//   console.log("hello world!");
  gulp.watch("sass/**/*.scss", gulp.series("styles"));
  gulp.watch("js/**/*.js", gulp.series("lint"));
  gulp.watch("/index.html", gulp.series("copy-html"));
  browserSync.init({
	  server: "./dist",
  });
  done();
}));

