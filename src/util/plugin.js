const events = require('../util/pick-for-events');

class Plugin {
  constructor(handlers = {}) {
    this.handlers = events.pick(handlers);
  }

  attach(pomodorojs) {
    events.forEach((e) => {
      const handler = this.handlers[e];
      if (handler) {
        pomodorojs.on(e, handler);
      }
    });

    return pomodorojs;
  }

  detach(pomodorojs) {
    events.forEach((e) => {
      const handler = this.handlers[e];
      if (handler) {
        pomodorojs.removeListener(e, handler);
      }
    });

    return pomodorojs;
  }
}


module.exports = Plugin;
