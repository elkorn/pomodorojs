var should = require('should');
var sinon = require('sinon');

describe('Generator', () => {
  'use strict';
  var clock;

  it('SHOULD support for-of', () => {
    function * naturalNumbers() {
      for (let n = 0;; n++) {
        yield n;
      }
    }

    var x = 0;
    for (let n of naturalNumbers()) {
      n.should.equal(x++);
      if (n > 10) {
        break;
      }
    }
  });

  before(() => clock = sinon.useFakeTimers());
  after(() => clock.restore());

  it('SHOULD support async', () => {
    let spy = sinon.spy();
    var x = 0;

    function * naturalNumbers(cb) {
      for (let n = 0;; n++) {
        setTimeout(() => cb(n), n * 100);
        yield n;
      }
    }

    for (let n of naturalNumbers(spy)) {
      clock.tick(x++ * 100);
      spy.callCount.should.equal(x);
      if(n > 10) {
        break;
      }
    }
  });
});
