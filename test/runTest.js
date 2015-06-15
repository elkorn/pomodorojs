'use strict';

import run from '../src/util/run.js';
import thunk from '../src/util/thunk.js';

describe('Run', () => {
  let randomTime = () => Math.random() * 10;

  it('SHOULD run thunk generators', (done) => {
    let delayReturn = (arr, callback) => {
      for (let val of arr) {
        setTimeout(() => {
          console.log("calling to", callback.toString());
          callback(null, val)
        }, randomTime());
      }
    };


    let th = thunk(delayReturn);
    let arr = [1, 2, 3, 4, 5];
    var x = 0;

    run(function * () {
      let result = yield th(arr);
      console.log(result);
      arr.indexOf(result).should.not.equal(-1);
      done();
    });
  });

});
