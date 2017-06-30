'use strict';

const sinon = require('sinon');
const EventEmitter = require('events');
const util = require('util');

const { EVENTS } = require('../src/pomodoro');
const StatePlugin = require('../src/plugins/state');

describe('State plugin', () => {
  const test = (fn, initialState = '') => () => {
    const backend = {
      getState: sinon.stub().returns(initialState),
      setState: sinon.spy(),
    };

    const state = new StatePlugin({ backend });
    const pomodoro = new EventEmitter();

    state.attach(pomodoro);

    return fn({ backend, state, pomodoro });
  };

  it('SHOULD not set anything on starting a pomdoro', test(
    ({ backend, pomodoro }) => {
      pomodoro.emit(EVENTS.pomodoroStart);
      sinon.assert.notCalled(backend.getState);
      sinon.assert.notCalled(backend.setState);
    })
  );

  it('SHOULD store current pomodoro time on tick', test(
    ({ backend, pomodoro }) => {
    pomodoro.emit(EVENTS.pomodoroTick, { time: 5000 });

    sinon.assert.calledOnce(backend.getState);
    sinon.assert.calledWith(backend.setState, `pomodoro|0|00:05`);
    })
  );

  it('SHOULD store current pomodoro number on break', test(
    ({ backend, pomodoro }) => {
      pomodoro.emit(EVENTS.pomodoroBreak);

      sinon.assert.calledOnce(backend.getState);
      sinon.assert.calledWith(backend.setState, `pomodoro|4|00:00`);
    }, `pomodoro|3|00:00`)
    );

  it('SHOULD store current pomodoro number on big break', test(
    ({ backend, pomodoro }) => {
      pomodoro.emit(EVENTS.pomodoroBigBreak);

      sinon.assert.calledOnce(backend.getState);
      sinon.assert.calledWith(backend.setState, `pomodoro|10|00:00`);
    }, `pomodoro|9|00:00`)
  );

  it('SHOULD reset pomodoro time', test(
    ({ backend, pomodoro }) => {
      pomodoro.emit(EVENTS.pomodoroReset);

      sinon.assert.calledOnce(backend.getState);
      sinon.assert.calledWith(backend.setState, `pomodoro|18|--:--`);
    }, `pomodoro|18|23:00`)
  );

  it('SHOULD provide defaults for invalid state format', test(
    ({backend, pomodoro}) => {
      pomodoro.emit(EVENTS.pomodoroTick, { time: 5000 });

      sinon.assert.calledOnce(backend.getState);
      sinon.assert.calledWith(backend.setState, `pomodoro|0|00:05`);
    }, `-12-30`)
  );

  it('SHOULD provide defaults for incorrect state', test(
    ({backend, pomodoro}) => {
      pomodoro.emit(EVENTS.pomodoroTick, { time: 5000 });

      sinon.assert.calledOnce(backend.getState);
      sinon.assert.calledWith(backend.setState, `pomodoro|0|00:05`);
    }, `0|0|`)
  );
});
