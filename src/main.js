var PomodoroJS = require("./pomodoro.js");
var state = require("./state");
var pr = require("./purple-remote");
var notifier = require("./notifier");
var format = require("util").format;
var sound = require("./sound");
var stats = require("./stats");

state.resetTime();
var t = new PomodoroJS();
var shouldBeWaiting = false;
var timeout;

function wait() {
    if (shouldBeWaiting) {
        timeout = setTimeout(wait, 100);
    } else {
        clearTimeout(timeout);
    }
}

exports.start = function() {
    t.on("pomodoroTick", function(data) {
        state.recordTime(data.time);
    });

    t.on("pomodoroStart", function() {
        notifier.notify("Get to work!");
        pr.changeStatus({
            status: "unavailable",
            message: "Pomodoro"
        });
        sound.play();
    });

    t.on("pomodoroFinish", function() {
        state.recordPomodoro();
        notifier.notify(
            format(
                "Finished! Have a %sbreak!",
                t.shouldGoForALongBreak() ? "long " : ""));
        pr.changeStatus({
            status: "available",
            message: ""
        });
        sound.play();
        stats.getTagsForPomodoro(function() {
            shouldBeWaiting = false;
            t.
            continue ();
        });

        wait();
    });

    t.start();

    process.on("SIGINT", function() {
        pr.changeStatus({
            status: "available",
            message: ""
        });
        state.resetTime();
        process.exit(0);
    });
};
