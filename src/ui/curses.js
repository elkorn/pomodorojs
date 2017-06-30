const path = require('path');
const spawn = require('child_process').spawn;
const format = require('util').format;
const fs = require('fs');

const UI = require('./base');

const tempfile = path.resolve(__dirname, '../.tempfile');
const INPUT_BOX_PARAMS = ['-e', format('dialog --inputbox \'Tags for pomodoro:\' 8 40 2> %s', tempfile)];

const getTempData = () => fs.readFileSync(tempfile, {
  encoding: 'utf-8'
});

class Curses extends UI {
  constructor() {
    super();

    if (!fs.existsSync(tempfile)) {
      fs.writeFileSync(tempfile, '');
    }
  }

  showTagDialog() {
    return new Promise((resolve, reject) => {
      const dialog = spawn('xterm', INPUT_BOX_PARAMS);
      dialog.on('close', (data) => {
        resolve(getTempData());
      });

      dialog.on('error', reject);
    });
  }

  start({ pomodorojs }) {
    pomodorojs.reset();
    pomodorojs.start();
  }

  exit({ pomodorojs }) {
    pomodorojs.reset();
  }
}

module.exports = Curses;
