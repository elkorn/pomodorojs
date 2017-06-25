'use strict';

const PomodoroJS =  require('./pomodoro');

const state = require('./state');
const pr = require('./purple-remote');
const notifier = require('./notifier');
const format = require('util').format;
const sound = require('./sound');
const stats = require('./stats');
const signals = require('./signals');

state.resetTime();

const t = new PomodoroJS();
const shouldBeWaiting = false;
let timeout;

function wait() {
  if (shouldBeWaiting) {
    timeout = setTimeout(wait, 100);
  } else {
    clearTimeout(timeout);
  }
}

function exitGracefully() {
  pr.restoreStatus();
  state.resetTime();
  process.exit(0);
}

signals.onInterrupt(exitGracefully);
signals.onTerminate(exitGracefully);

exports.start = function() {

  t.on('pomodoroTick', function(data) {
    state.recordTime(data.time);
  });

  t.on('pomodoroStart', function() {
    notifier.notify('Get to work!');
    pr.changeStatus({
      status: 'unavailable',
      message: 'Pomodoro'
    });
    sound.play();
  });

  t.on('pomodoroFinish', function() {
    state.recordPomodoro();
    notifier.notify(
      format(
        'Finished! Have a %sbreak!',
        t.shouldGoForALongBreak() ? 'long ' : ''));
    pr.restoreStatus();
    sound.play();
    stats.getTagsForPomodoro(function() {
      shouldBeWaiting = false;
      t.
        continue();
    });

    wait();
  });

  t.start();

};
