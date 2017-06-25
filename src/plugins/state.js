'use strict';

const fs = require('fs');
const format = require('util').format;
const path = require('path');
const zpad = require('zpad');
const Plugin = require('../util/plugin');
const { EVENTS } = require('../pomodoro');

zpad.amount(2);

function toMinuteDisplay(msec) {
  if (isNaN(msec)) {
    return '--:--';
  }

  const d = new Date(msec);
  return format('%s:%s', zpad(d.getMinutes()), zpad(d.getSeconds()));
}

function unmarshalState(state) {
  if (!state) {
    return {
      state: 'pomodoro',
      number: 0,
      timeLeft: '',
    };
  }

  const data = state.split('|');
  return {
    state: data[0] || 'pomodoro',
    number: parseInt(data[1]) || 0,
    timeLeft: data[2] || ''
  };
}

function marshalState(state) {
  return format('%s|%s|%s', state.state, state.number, toMinuteDisplay(state.timeLeft || 0));
}

const modifyState = (stateModification) => (stateFilePath) => (...args) => {
  const state = fs.readFileSync(stateFilePath, {
    encoding: 'utf8'
  }).trim();

  const stateInfo = unmarshalState(state);
  fs.writeFileSync(stateFilePath, marshalState(stateModification(stateInfo, ...args)));
}

const recordPomodoro = modifyState(stateInfo => {
  if (stateInfo === null) {
    return {
      state: 'pomodoro',
      number: 1
    };
  }

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
    stateFilePath = path.resolve(process.cwd(), '..', 'statefile'),
  } = {}) {
    if (!fs.existsSync(stateFilePath)) {
      fs.writeFileSync(stateFilePath);
    }

    super({
      [EVENTS.pomodoroTick]: recordTime(stateFilePath),
      [EVENTS.pomodoroBreak]: recordPomodoro(stateFilePath),
      [EVENTS.pomodoroBigBreak]: recordPomodoro(stateFilePath),
      [EVENTS.pomodoroReset]: resetTime(stateFilePath),
    });
  }
};
