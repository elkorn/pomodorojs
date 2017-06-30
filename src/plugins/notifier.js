'use strict';

const libnotify = require('libnotify');
const Plugin = require('../util/plugin');
const { EVENTS } = require('../core');

const defaultNotifier = {
  notify: (message = '', title = 'PomodoroJS') => {
    libnotify.notify(message, {
      title,
    });
  }
};

const defaultMessages = {
  [EVENTS.pomodoroStart] : 'Get to work!',
  [EVENTS.pomodoroBreak] :'Finished! Have a break!',
  [EVENTS.pomodoroBigBreak] :'Finished! Have a long break!',
}

module.exports = class Notifier extends Plugin {
  constructor(messages = defaultMessages, notifier = defaultNotifier) {

    const notifyOn = (eventName) => {
      const result = {};
      if (EVENTS.hasOwnProperty(eventName) && messages.hasOwnProperty(eventName)) {
        result[eventName] = () => notifier.notify(messages[eventName]);
      }

      return result;
    };

    super(Object.assign({},
      notifyOn(EVENTS.pomodoroStart),
      notifyOn(EVENTS.pomodoroBreak),
      notifyOn(EVENTS.pomodoroBigBreak)
    ));
  }
};
