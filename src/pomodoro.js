var timespan = require("timespan");
var aSecond = timespan.fromSeconds(1).msecs;
var ee = require("events").EventEmitter;
var util = require("util");

function TimeUp() {}

util.inherits(TimeUp, ee);

var timeUp = new TimeUp();

var durations = {
    "pomodoro": timespan.fromSeconds(5).msecs,
    "break": timespan.fromSeconds(5).msecs,
    "bigBreak": timespan.fromSeconds(15).msecs
};

var sm = require("state-machine");

function noop() {}

function PomodoroJS(options) {
    var self = this;
    var howManyPomodoros = 0;
    var currentTime;
    var timeout;

    function progressTime() {
        if (currentTime === 0) {
            timeUp.emit("timeUp");
        } else {
            currentTime -= aSecond;
            self.emit("pomodoroTick", {
                time: currentTime
            });

            options.onPomodoroTick(currentTime);
            timeout = setTimeout(progressTime, aSecond);
        }
    }

    function startTimer() {
        clearTimeout(timeout);
        progressTime();
    }

    options = options || {};

    var pomodoroStates = sm(function() {
        this.state("break", {
            initial: true,
            enter: function() {
                self.emit("pomodoroFinish");
                options.onPomodoroFinish();
                currentTime = durations["break"];
                startTimer();
            }
        })
            .state("bigBreak", {
                enter: function() {
                    self.emit("pomodoroFinish");
                    options.onPomodoroFinish();
                    currentTime = durations.bigBreak;
                    startTimer();
                }
            })
            .state("pomodoro", {
                enter: function() {
                    self.emit("pomodoroStart");
                    options.onPomodoroStart();
                    currentTime = durations.pomodoro;
                    startTimer();
                }
            })
            .event("startPomodoro", ["break", "bigBreak"], "pomodoro")
            .event("goForABreak", "pomodoro", "break")
            .event("goForABigBreak", "pomodoro", "bigBreak");
    });

    options.onPomodoroStart = options.onPomodoroStart || noop;
    options.onPomodoroFinish = options.onPomodoroFinish || noop;
    options.onPomodoroTick = options.onPomodoroTick || noop;
    options.onStateChange = options.onStateChange || noop;

    timeUp.on("timeUp", function() {
        if (pomodoroStates.currentState() === "pomodoro") {
            howManyPomodoros += 1;
            if (howManyPomodoros % 4 === 0) {
                pomodoroStates.goForABigBreak();
            } else {
                pomodoroStates.goForABreak();
            }
        } else {
            pomodoroStates.startPomodoro();
        }
    });

    pomodoroStates.onChange = options.onStateChange;
    this.start = function() {
        pomodoroStates.startPomodoro();
    };
}

util.inherits(PomodoroJS, ee);

module.exports = PomodoroJS;