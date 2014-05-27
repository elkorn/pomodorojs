#!/usr/bin/node

var PomodoroJS = require("./src/pomodoro.js");
var state = require("./src/state");
var pr = require("./src/purple-remote");
var notifier = require("./src/notifier");
var format = require("util").format;
var sound = require("./src/sound");

state.resetTime();
var t = new PomodoroJS();

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
            t.currentState() === "bigBreak" ? "long " : ""));
    pr.changeStatus({
        status: "available",
        message: ""
    });
    sound.play();
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