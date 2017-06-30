const events = [
  'pomodoroStart',
  'pomodoroBreak',
  'pomodoroBigBreak',
  'pomodoroTick',
  'pomodoroReset'
];

module.exports = require('mirrorkey')(events);
