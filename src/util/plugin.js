'use strict';

import R from 'ramda';

let POMODORO_EVENTS = [
  'pomodoroStart',
  'pomodoroFinish',
  'pomodoroTick'
];

class Plugin {
  constructor(handlers) {
    this.handlers = R.pick(
      POMODORO_EVENTS,
      handlers);
  }

  apply(pomodorojs) {
    POMODORO_EVENTS.forEach((e) => {
      pomodorojs.on(e, this.handlers[e]);
    });

    return pomodorojs;
  }
}


export
default Plugin;
