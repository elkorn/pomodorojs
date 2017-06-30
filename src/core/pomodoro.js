const timespan = require('timespan');
const EventEmitter = require('events').EventEmitter;

const createPomodoroStates = require('./stateMachine');
const EVENTS = require('./events');
const aSecond = require('timespan').fromSeconds(1).msecs;

const defaultDurations = {
  pomodoro: timespan.fromMinutes(25),
  break: timespan.fromMinutes(5),
  bigBreak: timespan.fromMinutes(15),
};

function PomodoroJS({ durations = defaultDurations, plugins } = {}) {
  const pomodoroEmitter = new EventEmitter();
  const timeUp = new EventEmitter();
  let handlersInProgress = [];
  let pomodorosSoFar = 0;
  let currentTime;
  let timeout;

  const on = (e, handler) => {
    pomodoroEmitter.on(e, (...args) => {
      handlersInProgress.push(Promise.resolve().then(() => handler(...args)));
    });
  };

  const removeListener = pomodoroEmitter.removeListener.bind(pomodoroEmitter);

  plugins.forEach(plugin => plugin.attach({ on, removeListener }));

  const afterHandlersAreDone = (fn) => {
    Promise.all(handlersInProgress).then(() => {
      handlersInProgress = [];
      fn();
    });
  };

  const progressTime = () => {
    if (currentTime === 0) {
      timeUp.emit('timeUp');
    } else {
      currentTime -= aSecond;
      pomodoroEmitter.emit(EVENTS.pomodoroTick, {
        time: currentTime,
      });

      timeout = setTimeout(progressTime, aSecond);
    }
  };

  const startTimer = () => {
    clearTimeout(timeout);
    afterHandlersAreDone(progressTime);
  };

  const pomodoroStates = createPomodoroStates({
    onPomodoro: () => {
      pomodoroEmitter.emit(EVENTS.pomodoroStart);
      startTimer(durations.pomodoro.msecs);
    },
    onBreak: () => {
      pomodoroEmitter.emit(EVENTS.pomodoroBreak);
      startTimer(durations.break.msecs);
    },
    onBigBreak: () => {
      pomodoroEmitter.emit(EVENTS.pomodoroBigBreak);
      startTimer(durations.bigBreak.msecs);
    },
  });

  const moveOn = () => {
    if (pomodorosSoFar % 4 === 0) {
      pomodoroStates.goForABigBreak();
      pomodorosSoFar %= 4;
    } else {
      pomodoroStates.goForABreak();
    }
  };

  timeUp.on('timeUp', () => {
    if (pomodoroStates.currentState() === 'pomodoro') {
      pomodoroStates.pause();
      pomodorosSoFar += 1;
      moveOn();
    } else {
      pomodoroStates.startPomodoro();
    }
  });

  this.start = () => {
    pomodoroStates.startPomodoro();
  };

  this.reset = () => {
    pomodoroEmitter.emit(EVENTS.pomodoroReset);
  };
}

module.exports = PomodoroJS;
