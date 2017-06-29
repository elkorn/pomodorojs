'use strict';

const { PomodoroJS, EVENTS } =  require('./pomodoro');

const StatePlugin = require('./plugins/state');
// const pr = require('./purple-remote');
const NotifierPlugin = require('./plugins/notifier');
const format = require('util').format;
const SoundPlugin = require('./plugins/sound');
// const stats = require('./stats');
const signals = require('./signals');

const plugins = [
  new StatePlugin(),
  new NotifierPlugin(),
  new SoundPlugin(),
];

const pomodoro = new PomodoroJS();

function exitGracefully() {
  pomodoro.reset();
  process.exit(0);
}

signals.onInterrupt(exitGracefully);
signals.onTerminate(exitGracefully);

plugins.forEach(plugin => plugin.attach(pomodoro));
pomodoro.reset();
// pomodoro.on(EVENTS.pomodoroStart, function() {
//   // notifier.notify('Get to work!');
//   // pr.changeStatus({
//   //   status: 'unavailable',
//   //   message: 'Pomodoro'
//   // });
//   // sound.play();
// });

pomodoro.on(EVENTS.pomodoroBreak, function() {
  // state.recordPomodoro();
  // notifier.notify('Finished! Have a break!');
  // pr.restoreStatus();
  // sound.play();

  // shouldBeWaiting = false;
  // pomodoro.continue();
  // stats.getTagsForPomodoro(function() {
  //   shouldBeWaiting = false;
  //   t.
  //     continue();
  // });

  // wait();
});

pomodoro.on(EVENTS.pomodoroBigBreak, () => {
  // state.recordPomodoro();
  // notifier.notify('Finished! Have a long break!');
  // pr.restoreStatus();
  // sound.play();
  // stats.getTagsForPomodoro(function() {
  //   shouldBeWaiting = false;
  // });

  // pomodoro.continue();
  // wait();
});


// pomodoro.on(EVENTS.pomodoroTick, function(data) {
//   state.recordTime(data.time);
// });

exports.start = function() {

  pomodoro.start();
};
