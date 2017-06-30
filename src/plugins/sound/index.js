const Plugin = require('../../util/plugin');
const { EVENTS } = require('../../core');

const defaultBackend = require('./backend');

module.exports = class SoundPlugin extends Plugin {
  constructor({ backend = defaultBackend } = {}) {
    const play = backend.play.bind(backend);
    super({
      [EVENTS.pomodoroStart]: play,
      [EVENTS.pomodoroBreak]: play,
      [EVENTS.pomodoroBigBreak]: play,
    });
  }
};
