#!/usr/bin/node

const app = require("./src/main");
const args = require("minimist")(process.argv.slice(2));
const stats = require("./src/plugins/stats");
const timespan = require("timespan");
const argNames = Object.keys(args).filter(function(argName) { return argName !== "_"; });
const noArgs = argNames.length === 0; // Only the `_` arg is present.

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

const SUPPORTED_ARGS = ["a", "all", "today", "time", "n", "numberOnly", "tags", "h", "help"];

function main() {
  if (noArgs) {
    app.start();
  } else {
    const criteria = {};
    if (args.a || args.all) {
      showPomodorosForCriteria(criteria);
    }

    if(args.h || args.help) {
      printUsageInfo();
      return;
    }

    if (args.today) {
      criteria.date = new Date();
    }

    const time = typeof(args.t) === 'undefined' ? args.time : args.t;
    if (typeof(time) !== 'undefined') {
      if (time === true) {
        criteria.date = new Date();
      } else if (!isNaN(time)) {
        const span = timespan.fromDays(time);
        criteria.date = new Date(new Date().valueOf() + (span ? span.msecs : 0));
      }
    }

    if (Object.keys(criteria).length) {
      showPomodorosForCriteria(criteria);
    } else {
      const unsupportedArgs = argNames.filter(function(argName) { return SUPPORTED_ARGS.indexOf(argName) === -1; });
      console.error("Given arguments" + (unsupportedArgs.length ? " (" + unsupportedArgs.join(",") + ")" : "")  + " are not supported. :(");
    }
  }
};

main();
