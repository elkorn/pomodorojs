'use strict';

const { EVENTS } = require('pomodorojs-core');
const sinon = require('sinon');
const EventEmitter = require('events');
const util = require('util');

const NotifierPlugin = require('../src/plugins/notifier');

const events = require('events');

describe('Notifier plugin', () => {
  const startMessage = 'startMessage';
  const breakMessage = 'breakMessage';
  const bigBreakMessage = 'bigBreakMessage';

  const messages = {
    [EVENTS.pomodoroStart]: startMessage,
    [EVENTS.pomodoroBreak]: breakMessage,
    [EVENTS.pomodoroBigBreak]: bigBreakMessage,
  };

  it('SHOULD notify on starting a pomdoro', () => {
    const notifySpy = sinon.spy();
    const notifier = new NotifierPlugin(messages, { notify: notifySpy });

    const pomodoro = new EventEmitter();

    notifier.attach(pomodoro);

    pomodoro.emit(EVENTS.pomodoroStart);

    sinon.assert.calledOnce(notifySpy);
    sinon.assert.calledWith(notifySpy, startMessage);
  });

  it('SHOULD notify on a break', () => {
    const notifySpy = sinon.spy();
    const notifier = new NotifierPlugin(messages, { notify: notifySpy });

    const pomodoro = new EventEmitter();

    notifier.attach(pomodoro);

    pomodoro.emit(EVENTS.pomodoroBreak);

    sinon.assert.calledOnce(notifySpy);
    sinon.assert.calledWith(notifySpy, breakMessage);
  });

  it('SHOULD notify on a big break', () => {
    const notifySpy = sinon.spy();
    const notifier = new NotifierPlugin(messages, { notify: notifySpy });

    const pomodoro = new EventEmitter();

    notifier.attach(pomodoro);

    pomodoro.emit(EVENTS.pomodoroBigBreak);

    sinon.assert.calledOnce(notifySpy);
    sinon.assert.calledWith(notifySpy, bigBreakMessage);
  });
});
