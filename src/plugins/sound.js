'use strict';

var spawn = require('child_process').spawn;
var path = require('path');

module.exports = {
  play: function() {
    spawn('mpg123', [path.resolve(__dirname, '../beep.mp3')]);
  }
};
