const timespan = require('timespan');
const format = require('util').format;

const { PomodoroJS, EVENTS } =  require('./pomodoro');
const StatePlugin = require('./plugins/state');
const StatsPlugin = require('./plugins/stats');
const NotifierPlugin = require('./plugins/notifier');
const SoundPlugin = require('./plugins/sound');
const signals = require('./signals');
const CursesUI = require('./ui/curses');

const durations = {
  pomodoro: timespan.fromSeconds(2),
  break: timespan.fromSeconds(2),
  bigBreak: timespan.fromSeconds(2),
};

const plugins = [
  new StatePlugin(),
  new NotifierPlugin(),
  new SoundPlugin(),
  new StatsPlugin({ ui: new CursesUI() }),
];

const pomodoro = new PomodoroJS({ durations });

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
