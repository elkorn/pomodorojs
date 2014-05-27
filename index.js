var PomodoroJS = require("./src/pomodoro.js");
var state = require("./src/state");
var pr = require("./src/purple-remote");

var t = new PomodoroJS();

t.on("pomodoroTick", function(data) {
    state.recordTime(data.time);
});

t.on("pomodoroStart", function() {
    console.log("pomodoroStarted");

});

t.on("pomodoroFinish", function() {
    console.log("pomodoroFinish");
    state.recordPomodoro();
});

t.start();