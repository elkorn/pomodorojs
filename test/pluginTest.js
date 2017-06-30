'use strict';

const Plugin = require('../src/util/plugin');
const sinon = require('sinon');
const EventEmitter = require('events');
const util = require('util');
const { EVENTS } = require('../src/core');

const events = require('events');

describe('Plugin', () => {
  it('SHOULD accept handlers for Pomodoro events', () => {
    const handlers = {
      pomodoroStart: sinon.spy(),
      pomodoroBreak: sinon.spy(),
      pomodoroBigBreak: sinon.spy(),
      pomodoroTick: sinon.spy(),
      pomodoroReset: sinon.spy(),
      shouldNotBeIncluded: sinon.spy()
    };

    const plugin = new Plugin(handlers);

    plugin.handlers.should.have.property(EVENTS.pomodoroStart, handlers.pomodoroStart);
    plugin.handlers.should.have.property(EVENTS.pomodoroBreak, handlers.pomodoroBreak);
    plugin.handlers.should.have.property(EVENTS.pomodoroReset, handlers.pomodoroReset);
    plugin.handlers.should.have.property(EVENTS.pomodoroBigBreak, handlers.pomodoroBigBreak);
    plugin.handlers.should.have.property(EVENTS.pomodoroTick, handlers.pomodoroTick);
    plugin.handlers.should.not.have.property('shouldNotBeIncluded');
  });

  it('SHOULD attach handlers to correct events', () => {
    const handlers = {
      pomodoroStart: sinon.spy(),
      pomodoroBreak: sinon.spy(),
      pomodoroBigBreak: sinon.spy(),
      pomodoroTick: sinon.spy(),
      pomodoroReset: sinon.spy(),
    };
    const plugin = new Plugin(handlers);
    const pomodoro = new EventEmitter();

    plugin.attach(pomodoro);

    pomodoro.emit(EVENTS.pomodoroStart);
    handlers.pomodoroStart.calledOnce.should.be.equal(true);
    pomodoro.emit(EVENTS.pomodoroBreak);
    handlers.pomodoroBreak.calledOnce.should.be.equal(true);
    pomodoro.emit(EVENTS.pomodoroBigBreak);
    handlers.pomodoroBigBreak.calledOnce.should.be.equal(true);
    pomodoro.emit(EVENTS.pomodoroReset);
    handlers.pomodoroReset.calledOnce.should.be.equal(true);
    pomodoro.emit(EVENTS.pomodoroTick);
    handlers.pomodoroStart.calledOnce.should.be.equal(true);
    handlers.pomodoroBreak.calledOnce.should.be.equal(true);
    handlers.pomodoroTick.calledOnce.should.be.equal(true);
    handlers.pomodoroBigBreak.calledOnce.should.be.equal(true);
  });

  it('SHOULD detach handlers from correct events', () => {
    const handlers = {
      pomodoroStart: sinon.spy(),
      pomodoroBreak: sinon.spy(),
      pomodoroBigBreak: sinon.spy(),
      pomodoroTick: sinon.spy(),
      pomodoroReset: sinon.spy(),
    };

    const plugin = new Plugin(handlers);
    const pomodoro = new EventEmitter();

    plugin.attach(pomodoro);
    plugin.detach(pomodoro);

    pomodoro.emit(EVENTS.pomodoroStart);
    handlers.pomodoroStart.calledOnce.should.be.equal(false);
    pomodoro.emit(EVENTS.pomodoroBreak);
    handlers.pomodoroBreak.calledOnce.should.be.equal(false);
    pomodoro.emit(EVENTS.pomodoroBigBreak);
    handlers.pomodoroBigBreak.calledOnce.should.be.equal(false);
    pomodoro.emit(EVENTS.pomodoroReset);
    handlers.pomodoroReset.calledOnce.should.be.equal(false);
    pomodoro.emit(EVENTS.pomodoroTick);
    handlers.pomodoroStart.calledOnce.should.be.equal(false);
    handlers.pomodoroBreak.calledOnce.should.be.equal(false);
    handlers.pomodoroBigBreak.calledOnce.should.be.equal(false);
    handlers.pomodoroTick.calledOnce.should.be.equal(false);

  })
});
