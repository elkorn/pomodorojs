'use strict';

const mirrorkey = require('mirrorkey');
const timespan = require('timespan');
const aSecond = timespan.fromSeconds(1).msecs;
const EventEmitter = require('events').EventEmitter;
const util = require('util');

const EVENTS = mirrorkey([
  'pomodoroStart',
  'pomodoroBreak',
  'pomodoroBigBreak',
  'pomodoroTick',
  'pomodoroReset'
]);

function TimeUp() {}

util.inherits(TimeUp, EventEmitter);

const timeUp = new TimeUp();

// TODO customizable.
const durations = {
  'pomodoro': timespan.fromSeconds(2).msecs,
  'break': timespan.fromSeconds(2).msecs,
  'bigBreak': timespan.fromSeconds(2).msecs
};

const sm = require('state-machine');

function PomodoroJS() {
  const self = this;
  let pomodorosSoFar = 0;
  let currentTime;
  let timeout;
  const emitter = new EventEmitter();
  let handlersInProgress = [];

  function progressTime() {
    if (currentTime === 0) {
      timeUp.emit('timeUp');
    } else {
      currentTime -= aSecond;
      emitter.emit(EVENTS.pomodoroTick, {
        time: currentTime
      });

      timeout = setTimeout(progressTime, aSecond);
    }
  }

  function startTimer() {
    clearTimeout(timeout);
    afterHandlersAreDone(progressTime);
  }

  function emit(e) {
    emitter.emit(e);
  }

  function afterHandlersAreDone(fn) {
    Promise.all(handlersInProgress).then(() => {
      handlersInProgress = [];
      fn();
    });
  }

  function moveOn () {
    if (pomodorosSoFar % 4 === 0) {
      pomodoroStates.goForABigBreak();
      pomodorosSoFar %= 4;
    } else {
      pomodoroStates.goForABreak();
    }
  };

  const pomodoroStates = sm(function() {
    this.state('break', {
      initial: true,
      enter: function() {
        emit(EVENTS.pomodoroBreak);
        currentTime = durations.break;
        startTimer();
      }
    })
      .state('bigBreak', {
        enter: function() {
          emit(EVENTS.pomodoroBigBreak);
          currentTime = durations.bigBreak;
          startTimer();
        }
      })
      .state('pomodoro', {
        enter: function() {
          emit(EVENTS.pomodoroStart);
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
      moveOn();
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

  this.reset = function() {
    emit(EVENTS.pomodoroReset);
  };

  this.on = (e, handler) => {
    emitter.on(e, (...args) => {
      handlersInProgress.push(Promise.resolve().then(() => handler(...args)));
    });
  };

  this.removeListener = emitter.removeListener.bind(emitter);
}

module.exports = {
  PomodoroJS,
  EVENTS,
};
