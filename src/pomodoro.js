'use strict';

let timespan = require('timespan');
let aSecond = timespan.fromSeconds(1).msecs;
let ee = require('events').EventEmitter;
let util = require('util');

let POMODORO_EVENTS = [
  'pomodoroStart',
  'pomodoroFinish',
  'pomodoroTick'
];

function TimeUp() {}

util.inherits(TimeUp, ee);

let timeUp = new TimeUp();

// TODO customizable.
let durations = {
  'pomodoro': timespan.fromMinutes(25).msecs,
  'break': timespan.fromMinutes(5).msecs,
  'bigBreak': timespan.fromMinutes(15).msecs
};

let sm = require('state-machine');

function noop() {}

function PomodoroJS() {
  let self = this;
  var pomodorosSoFar = 0;
  var currentTime;
  var timeout;

  function progressTime() {
    if (currentTime === 0) {
      timeUp.emit('timeUp');
    } else {
      currentTime -= aSecond;
      self.emit('pomodoroTick', {
        time: currentTime
      });

      timeout = setTimeout(progressTime, aSecond);
    }
  }

  function startTimer() {
    clearTimeout(timeout);
    progressTime();
  }

  let pomodoroStates = sm(function() {
    this.state('break', {
      initial: true,
      enter: function() {
        currentTime = durations['break'];
        startTimer();
      }
    })
      .state('bigBreak', {
        enter: function() {
          currentTime = durations.bigBreak;
          startTimer();
        }
      })
      .state('pomodoro', {
        enter: function() {
          self.emit('pomodoroStart');
          currentTime = durations.pomodoro;
          startTimer();
        }
      })
      .state('paused')
      .event('startPomodoro', ['break', 'bigBreak'], 'pomodoro')
      .event('goForABreak', 'paused', 'break')
      .event('goForABigBreak', 'paused', 'bigBreak')
      .event('pause', 'pomodoro', 'paused');
  });

  timeUp.on('timeUp', function() {
    if (pomodoroStates.currentState() === 'pomodoro') {
      pomodoroStates.pause();
      ++pomodorosSoFar;
      self.emit('pomodoroFinish');
    } else {
      pomodoroStates.startPomodoro();
    }
  });

  this.start = function() {
    pomodoroStates.startPomodoro();
  };

  this.currentState = function() {
    return pomodoroStates.currentState();
  };

  this.continue = function() {
    if (pomodorosSoFar % 4 === 0) {
      pomodoroStates.goForABigBreak();
      pomodorosSoFar %= 4;
    } else {
      pomodoroStates.goForABreak();
    }
  };

  this.shouldGoForALongBreak = function() {
    return pomodorosSoFar % 4 === 0;
  };
}

util.inherits(PomodoroJS, ee);

module.exports = {
  PomodoroJS: PomodoroJS,
  EVENTS: POMODORO_EVENTS
};
