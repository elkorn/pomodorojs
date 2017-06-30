const sm = require('state-machine');

module.exports = ({ onPomodoro, onBreak, onBigBreak } = {}) => sm(function() {
  this.state('break', {
    initial: true,
    enter: onBreak,
  })
  .state('bigBreak', {
    enter: onBigBreak,
  })
  .state('pomodoro', {
    enter: onPomodoro,
  })
  .state('paused')
  .event('startPomodoro', ['break', 'bigBreak'], 'pomodoro')
  .event('goForABreak', 'paused', 'break')
  .event('goForABigBreak', 'paused', 'bigBreak')
  .event('pause', 'pomodoro', 'paused');
});
