'use strict';

const libnotify = require('libnotify');
const Plugin = require('../util/plugin');
const { EVENTS } = require('../pomodoro');

let notify = (message = '', title = 'PomodoroJS') => {
  libnotify.notify(message, {
    title: title
  });
};

module.exports = class Notifier extends Plugin {
  constructor(messages) {
    super({
      [EVENTS.pomodoroStart]: () => notify('Get to work!'),
      [EVENTS.pomodoroBreak]: () => notify('Finished! Have a break!'),
      [EVENTS.pomodoroBigBreak]: () => notify('Finished! Have a long break!')
    });
  }
};
