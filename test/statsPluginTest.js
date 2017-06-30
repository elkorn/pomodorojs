'use strict';

const sinon = require('sinon');
const EventEmitter = require('events');
const util = require('util');

const { EVENTS } = require('../src/pomodoro');
const StatsPlugin = require('../src/plugins/stats');

describe('Stats Plugin', () => {
  const test = (fn, {
    ui = {
      showTagDialog: sinon.stub().returns(Promise.resolve())
    },
    backend = {
      getStats: sinon.spy(),
      storeTagInfo: sinon.spy(),
    },
  } = {}) => (done) => {
    const stats = new StatsPlugin({ ui, backend });
    const pomodoro = new EventEmitter();

    stats.attach(pomodoro);

    fn({ backend, done, pomodoro, ui });
  };

  it('SHOULD ask for pomdoro tags on break', test(
    ({ done, pomodoro, ui }) => {
      pomodoro.emit(EVENTS.pomodoroBreak);

      sinon.assert.calledOnce(ui.showTagDialog);
      done();
    })
  );

  it('SHOULD ask for pomdoro tags on big break', test(
  ({ done, pomodoro, ui }) => {
    pomodoro.emit(EVENTS.pomodoroBigBreak);

    sinon.assert.calledOnce(ui.showTagDialog);
    done();
  })
  );

  it('SHOULD store the new tags', test(
    ({ done, pomodoro, backend }) => {
      pomodoro.emit(EVENTS.pomodoroBreak);

      setTimeout(() => {
        sinon.assert.calledOnce(backend.storeTagInfo);
        sinon.assert.calledWith(backend.storeTagInfo, 'test tag');
        done();
      }, 1);
    }, { ui: { showTagDialog: sinon.stub().returns(Promise.resolve('test tag'))} })
  );

  describe('SHOULD get stored pomodoros', () => {
    it('for a date', () => {
      const date = new Date();
      const anotherDate = new Date();
      anotherDate.setYear(1999);
      const result =`${date.toString()}`;
      const backendSuccess = {
        getStats: () => [result, anotherDate.toString()],
      };
      const backendFailure = {
        getStats: () => [anotherDate.toString()],
      };

      StatsPlugin.getPomodoros({ date }, backendSuccess).should.equal(result);
      StatsPlugin.getPomodoros({ date }, backendFailure).should.equal('');
    });

    it('for tags', () => {
      const tags = ['tagA', 'tagB', 'tagC'];
      const result = tags.join();
      const backendSuccess = {
        getStats: () => [ tags[0], tags[1], tags[2], result, `${tags[1]} ${tags[0]}`],
      };

      const backendFailure = {
        getStats: () => [ tags[0], tags[1], tags[2], `${tags[1]} ${tags[0]}`],
      };

      StatsPlugin.getPomodoros({ tags }, backendSuccess).should.equal(result);
      StatsPlugin.getPomodoros({ tags }, backendFailure).should.equal('');
    });

    it('for date and tags', () => {
      const date = new Date();
      const tags = ['tagA', 'tagB', 'tagC'];
      const anotherDate = new Date();
      anotherDate.setYear(1999);
      const result =`${date.toString()}: ${tags.join()}`;
      const backendSuccess = {
        getStats: () => [result, anotherDate.toString()],
      };
      const backendFailure1 = {
        getStats: () => [`${anotherDate.toString()}: ${tags.join()}`],
      };
      const backendFailure2 = {
        getStats: () => [ `${date.toString()}: ${tags[1]} ${tags[0]}`],
      };
      const backendFailure3 = {
        getStats: () => [`${anotherDate.toString()}: ${tags[1]} ${tags[0]}`],
      };

      StatsPlugin.getPomodoros({ date, tags }, backendSuccess).should.equal(result);
      StatsPlugin.getPomodoros({ date, tags }, backendFailure1).should.equal('');
      StatsPlugin.getPomodoros({ date, tags }, backendFailure2).should.equal('');
      StatsPlugin.getPomodoros({ date, tags }, backendFailure3).should.equal('');
    });

    it('with count', () => {
      const tags = ['tagA', 'tagB', 'tagC'];
      const wantedTag = tags[0];
      const result = tags.join();
      const backendSuccess = {
        getStats: () => [ wantedTag, tags[1], tags[2], `${tags[1]} ${wantedTag}`],
      };

      const backendFailure = {
        getStats: () => [ tags[2], tags[1], tags[2], `${tags[1]} ${tags[2]}`],
      };

      StatsPlugin.getPomodoros({ tags: [wantedTag], onlyCount: true }, backendSuccess).should.equal(2);
      StatsPlugin.getPomodoros({ tags: [wantedTag], onlyCount: true }, backendFailure).should.equal(0);
    });
  });
});
