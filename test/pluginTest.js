'use strict';

import Plugin from '../src/util/plugin';
import sinon from 'sinon';
import EventEmitter from 'events';
import util from 'util';

import events from 'events';

describe('Plugin', () => {
  it('SHOULD accept handlers for Pomodoro events', () => {
    let handlers = {
      pomodoroStart: sinon.spy(),
      pomodoroFinish: sinon.spy(),
      pomodoroTick: sinon.spy(),
      shouldNotBeIncluded: sinon.spy()
    };

    let plugin = new Plugin(handlers);

    plugin.handlers.should.have.property('pomodoroStart', handlers.pomodoroStart);
    plugin.handlers.should.have.property('pomodoroFinish', handlers.pomodoroFinish);
    plugin.handlers.should.have.property('pomodoroTick', handlers.pomodoroTick);
    plugin.handlers.should.not.have.property('shouldNotBeIncluded');
  });

  it('SHOULD attach handlers to correct events', () => {
    let handlers = {
      pomodoroStart: sinon.spy(),
      pomodoroFinish: sinon.spy(),
      pomodoroTick: sinon.spy()
    };
    let plugin = new Plugin(handlers);
    let pomodoro = new EventEmitter();

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
