'use strict';

const run = require('../src/util/run.js');
const thunk = require('../src/util/thunk.js');

describe('Run', () => {
  const randomTime = () => Math.random() * 10;

  it('SHOULD run thunk generators', (done) => {
    const delayReturn = (arr, callback) => {
      for (let val of arr) {
        setTimeout(() => {
          callback(null, val);
        }, randomTime());
      }
    };


    const th = thunk(delayReturn);
    const arr = [1, 2, 3, 4, 5];
    var x = 0;

    run(function * () {
      const result = yield th(arr);
      arr.indexOf(result).should.not.equal(-1);
      done();
    });
  });
});
