const path = require('path');
const spawn = require('child_process').spawn;
const format = require('util').format;
const fs = require('fs');

const UI = require('./base');

const tempfile = path.resolve(__dirname, '../.tempfile');
const INPUT_BOX_PARAMS = ['-e', format('dialog --inputbox \'Tags for pomodoro:\' 8 40 2> %s', tempfile)];

const getTempData = () => fs.readFileSync(tempfile, {
  encoding: 'utf-8',
});

const showTagDialog = () => new Promise((resolve, reject) => {
  const dialog = spawn('xterm', INPUT_BOX_PARAMS);
  dialog.on('close', () => {
    resolve(getTempData());
  });

  dialog.on('error', reject);
});

const start = ({ pomodorojs }) => {
  pomodorojs.reset();
  pomodorojs.start();
};

const exit = ({ pomodorojs }) => {
  pomodorojs.reset();
};


class Curses extends UI {
  constructor() {
    super();

    if (!fs.existsSync(tempfile)) {
      fs.writeFileSync(tempfile, '');
    }

    this.showTagDialog = showTagDialog;
    this.start = start;
    this.exit = exit;
  }
}

module.exports = Curses;
