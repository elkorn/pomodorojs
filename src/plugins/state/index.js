'use strict';

const format = require('util').format;
const zpad = require('zpad');
const Plugin = require('../../util/plugin');
const { EVENTS } = require('../../pomodoro');
const fileStateBackend = require('./backend');

zpad.amount(2);

function toMinuteDisplay(msec) {
  if (isNaN(msec)) {
    return '--:--';
  }

  const d = new Date(msec);
  return format('%s:%s', zpad(d.getMinutes()), zpad(d.getSeconds()));
}

const initialState = {
  state: 'pomodoro',
  number: 0,
  timeLeft: '',
};

function unmarshalState(state) {
  if (!state) {
    return initialState;
  }

  const data = state.split('|');
  if (data.length === 3)  {
    return {
      state: 'pomodoro', // TODO handle 'break'
      number: parseInt(data[1]) || initialState.number,
      timeLeft: data[2] || initialState.timeLeft,
    };
  }

  return initialState;
}

function marshalState(state) {
  return format('%s|%s|%s', state.state, state.number, toMinuteDisplay(state.timeLeft || 0));
}

const modifyState = (stateModification) => (backend) => (...args) => {
  const stateInfo = unmarshalState(backend.getState());
  backend.setState(marshalState(stateModification(stateInfo, ...args)));
};

const recordPomodoro = modifyState(stateInfo => {
  return {
    state: stateInfo.state,
    number: stateInfo.number + 1
  };
});

const resetTime = modifyState(stateInfo => ({
  state: stateInfo.state,
  number: stateInfo.number,
  timeLeft: '--',
}));

const recordTime = modifyState((stateInfo, { time }) => ({
  state: stateInfo.state,
  number: stateInfo.number,
  timeLeft: time
}));

module.exports = class StatePlugin extends Plugin {
  constructor({
    backend = fileStateBackend
  } = {}) {
    super({
      [EVENTS.pomodoroTick]: recordTime(backend),
      [EVENTS.pomodoroBreak]: recordPomodoro(backend),
      [EVENTS.pomodoroBigBreak]: recordPomodoro(backend),
      [EVENTS.pomodoroReset]: resetTime(backend),
    });
  }
};
