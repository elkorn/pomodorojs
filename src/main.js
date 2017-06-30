// TODO this is the CLI driver.

const { PomodoroJS } = require('pomodorojs-core');

const NotifierPlugin = require('./plugins/notifier');
const SoundPlugin = require('./plugins/sound');

const CursesUI = require('./ui/curses');

const ui = new CursesUI();

const plugins = [
  new NotifierPlugin(),
  new SoundPlugin(),
];


module.exports = new PomodoroJS({ plugins, ui });
