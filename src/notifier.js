var libnotify = require("libnotify");

module.exports = {
  notify: function(summary) {
    libnotify.notify(summary, {
      title: 'PomodoroJS'
    });
  }
};
