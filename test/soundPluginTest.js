'use strict';

const sinon = require('sinon');
const EventEmitter = require('events');
const util = require('util');

const { EVENTS } = require('../src/pomodoro');
const SoundPlugin = require('../src/plugins/sound');

describe('Sound plugin', () => {
  const test = (fn) => () => {
    const backend = {
      play: sinon.stub(),
    };

    const sound = new SoundPlugin({ backend });
    const pomodoro = new EventEmitter();

    sound.attach(pomodoro);

    return fn({ backend, sound, pomodoro });
  };

  it('SHOULD play sound on pomodoro start', test(
    ({ backend, pomodoro }) => {
      pomodoro.emit(EVENTS.pomodoroStart);

      sinon.assert.calledOnce(backend.play);
    })
  );

  it('SHOULD play sound on pomodoro break', test(
    ({ backend, pomodoro }) => {
      pomodoro.emit(EVENTS.pomodoroBreak);

      sinon.assert.calledOnce(backend.play);
    })
  );

  it('SHOULD play sound on pomodoro big break', test(
    ({ backend, pomodoro }) => {
      pomodoro.emit(EVENTS.pomodoroBigBreak);

      sinon.assert.calledOnce(backend.play);
    })
  );
});
