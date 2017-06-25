'use strict';

const Plugin = require('../src/util/plugin');
const sinon = require('sinon');
const EventEmitter = require('events');
const util = require('util');

import events from 'events';

describe('Plugin', () => {
  it('SHOULD accept handlers for Pomodoro events', () => {
    const handlers = {
      pomodoroStart: sinon.spy(),
      pomodoroFinish: sinon.spy(),
      pomodoroTick: sinon.spy(),
      shouldNotBeIncluded: sinon.spy()
    };

    const plugin = new Plugin(handlers);

    plugin.handlers.should.have.property('pomodoroStart', handlers.pomodoroStart);
    plugin.handlers.should.have.property('pomodoroFinish', handlers.pomodoroFinish);
    plugin.handlers.should.have.property('pomodoroTick', handlers.pomodoroTick);
    plugin.handlers.should.not.have.property('shouldNotBeIncluded');
  });

  it('SHOULD attach handlers to correct events', () => {
    const handlers = {
      pomodoroStart: sinon.spy(),
      pomodoroFinish: sinon.spy(),
      pomodoroTick: sinon.spy()
    };
    const plugin = new Plugin(handlers);
    const pomodoro = new EventEmitter();

    plugin.apply(pomodoro);

    pomodoro.emit('pomodoroStart');
    handlers.pomodoroStart.calledOnce.should.be.equal(true);
    pomodoro.emit('pomodoroFinish');
    handlers.pomodoroFinish.calledOnce.should.be.equal(true);
    pomodoro.emit('pomodoroTick');
    handlers.pomodoroStart.calledOnce.should.be.equal(true);
    handlers.pomodoroFinish.calledOnce.should.be.equal(true);
    handlers.pomodoroTick.calledOnce.should.be.equal(true);
  });
});
