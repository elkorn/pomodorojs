'use strict';

const R = require('ramda');
const events =require( '../util/pick-for-events');

class Plugin {
  constructor(handlers = {}) {
    this.handlers = events.pick(handlers);
  }

  attach(pomodorojs) {
    events.forEach((e) => {
      if (this.handlers.hasOwnProperty(e)) {
        pomodorojs.on(e, this.handlers[e]);
      }
    });

    return pomodorojs;
  }

  detach(pomodorojs) {
    events.forEach((e) => {
      if (this.handlers.hasOwnProperty(e)) {
        pomodorojs.removeListener(e, this.handlers[e]);
      }
    });

    return pomodorojs;
  }
}


module.exports = Plugin;
