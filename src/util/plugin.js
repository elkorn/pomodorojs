'use strict';

const R = require('ramda');
const events =require( '../util/pick-for-events');

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


module.exports = Plugin;
