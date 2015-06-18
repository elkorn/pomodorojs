'use strict';

import R from 'ramda';
import events from '../util/pick-for-events';

class Plugin {
  constructor(handlers) {
    this.handlers = events.pick(handlers);
  }

  apply(pomodorojs) {
    events.forEach((e) => {
      pomodorojs.on(e, this.handlers[e]);
    });
    return pomodorojs;
  }
}


export
default Plugin;
