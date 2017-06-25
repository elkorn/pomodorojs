'use strict';

const spawn = require('child_process').spawn;
const path = require('path');

const Plugin = require('../util/plugin');
const { EVENTS } = require('../pomodoro');

const beep = path.resolve(__dirname, '../../beep.mp3');

const play = () => spawn('mpg123', [ beep ]);

module.exports = class SoundPlugin extends Plugin {
  constructor() {
    super({
      [EVENTS.pomodoroStart]: play,
      [EVENTS.pomodoroBreak]: play,
      [EVENTS.pomodoroBigBreak]: play,
    });
  }
};
