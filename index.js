#!/usr/bin/node

var app = require("./src/main");
var args = require("minimist")(process.argv.slice(2));
var stats = require("./src/stats");
var timespan = require("timespan");
var noArgs = Object.keys(args).length === 1;   // Only the `_` arg is present.

process.title = "PomodoroJS";

console.log(args.tags);

function showPomodorosForDate(date) {
    showPomodorosForCriteria({
        date: date
    });
}

function showPomodorosForCriteria(criteria) {
    criteria.onlyCount = args.n || args.numberOnly || false;
    criteria.tags = (args.tags || "").split(",");
    console.log(stats.getPomodoros(criteria));
}

if (noArgs) {
    app.start();
} else {
    var criteria = {};
    if (args.today) {
        criteria.date = new Date();
    }

    var time = args.t || args.time;
    if (time) {
        if(time === true) {
            criteria.date = new Date();
        } else if (!isNaN(time)) {
            criteria.date = new Date(new Date().valueOf() + timespan.fromDays(time).msecs);
        }
    }

    showPomodorosForCriteria(criteria);
}
