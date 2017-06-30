const Plugin = require('../../util/plugin');
const statsFileBackend = require('./backend');
const { EVENTS } = require('../../core');

const askForPomodoroTags =
      (ui, backend) => ui.showTagDialog().then(backend.storeTagInfo.bind(backend));

class StatsPlugin extends Plugin {
  constructor({ ui, backend = statsFileBackend }) {
    super({
      [EVENTS.pomodoroBreak]: () => askForPomodoroTags(ui, backend),
      [EVENTS.pomodoroBigBreak]: () => askForPomodoroTags(ui, backend),
    });
  }

  static getPomodoros({ date, onlyCount, tags = [] } = {}, backend = statsFileBackend) {
    let result = backend.getStats();
    if (date) {
      const dateStr = date.toString().slice(0, 10);
      result = result.filter(line => line.indexOf(dateStr) === 0);
    }

    if (tags.length) {
      result = result.filter(line => tags.every(tag => line.indexOf(tag) !== -1));
    }

    return onlyCount ? result.length : result.join('\n');
  }
}

module.exports = StatsPlugin;
