const Plugin = require('../util/plugin');


function showTagDialog() {
  throw new Error('showTagDialog: Not implemented.');
}

function start() {
  throw new Error('start: Not implemented.');
}

function exit() {
  throw new Error('exit: Not implemented.');
}

class UI extends Plugin {
  constructor(options) {
    super(options);
    this.showTagDialog = showTagDialog;
    this.start = start;
    this.exit = exit;
  }
}

module.exports = UI;
