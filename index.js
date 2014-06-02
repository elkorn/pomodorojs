#!/usr/bin/node

var app = require("./src/main");
var args = require("minimist")(process.argv.slice(2));
var stats = require("./src/stats");
var timespan = require("timespan");
var argNames = Object.keys(args).filter(function(argName) { return argName !== "_"; });
var noArgs = argNames.length === 0; // Only the `_` arg is present.
process.title = "pomodorojs";

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

var SUPPORTED_ARGS = ["a", "all", "today", "time", "n", "numberOnly", "tags"];

if (noArgs) {
    app.start();
} else {
    var criteria = {};
    if (args.a || args.all) {
        showPomodorosForCriteria(criteria);
        return;
    }

    if (args.today) {
        criteria.date = new Date();
    }

    var time = args.t || args.time;
    if (time) {
        if (time === true) {
            criteria.date = new Date();
        } else if (!isNaN(time)) {
            criteria.date = new Date(new Date().valueOf() + timespan.fromDays(time).msecs);
        }
    }

    if (Object.keys(criteria).length) {
        showPomodorosForCriteria(criteria);
    } else {
        var unsupportedArgs = argNames.filter(function(argName) { return SUPPORTED_ARGS.indexOf(argName) === -1; });
        console.error("Given arguments" + (unsupportedArgs.length ? " (" + unsupportedArgs.join(",") + ")" : "")  + " are not supported. :(");
    }
}
