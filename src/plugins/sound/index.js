const { Plugin, EVENTS } = require('pomodorojs-core');

const defaultBackend = require('./backend');

class SoundPlugin extends Plugin {
  constructor({ backend = defaultBackend } = {}) {
    const play = backend.play.bind(backend);

    super({
      [EVENTS.pomodoroStart]: play,
      [EVENTS.pomodoroBreak]: play,
      [EVENTS.pomodoroBigBreak]: play,
    });
  }
}

module.exports = SoundPlugin;
