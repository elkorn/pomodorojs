// TODO this is the CLI driver.

const format = require('util').format;

const { PomodoroJS, EVENTS } =  require('./core');
const StatePlugin = require('./plugins/state');
const StatsPlugin = require('./plugins/stats');
const NotifierPlugin = require('./plugins/notifier');
const SoundPlugin = require('./plugins/sound');
const signals = require('./signals');
const CursesUI = require('./ui/curses');

const ui = new CursesUI();

const plugins = [
  new StatePlugin(),
  new NotifierPlugin(),
  new SoundPlugin(),
  new StatsPlugin({ ui }),
];

const pomodorojs = new PomodoroJS({ plugins, signals });

function exitGracefully() {
  ui.exit({ pomodorojs });
  process.exit(0);
}

signals.onInterrupt(exitGracefully);
signals.onTerminate(exitGracefully);

exports.start = function() {
  ui.start({ pomodorojs });
};
