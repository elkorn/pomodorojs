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

function printUsageInfo() {
    console.log(
        "\n" +
        "       (no args)           Start pomodoroing.\n" +
        "       -a, -all            Show all pomodoros ever recorded.\n" +
        "       -h, -help           Print usage information.\n" +
        "       -n,-numberonly      Only show the number of pomodoros.\n" +
        "       -t, -today          Display pomodoros done today.\n" +
        "       --t=N, --time=N     Display pomodoros done N days from now. Sensible values are N<=0 e.g.\n" +
        "                           --t=0 - today,\n" +
        "                           --t=-1 - yesterday.\n" +
        "       --tags=a,b,c...     Only show pomodoros having any of the specified tags." +
        "\n"
    );
}

var SUPPORTED_ARGS = ["a", "all", "today", "time", "n", "numberOnly", "tags", "h", "help"];

if (noArgs) {
    app.start();
} else {
    var criteria = {};
    if (args.a || args.all) {
        showPomodorosForCriteria(criteria);
        return;
    }

    if(args.h || args.help) {
        printUsageInfo();
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
