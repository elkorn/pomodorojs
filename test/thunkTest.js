'use strict';

const thunk = require('../src/util/thunk');

describe('Thunk', ()=>{
  it('SHOULD convert any function into a thunk', () => {
    const input = [1,2,3];
    const sum = (arr, callback) => {
      callback(arr.reduce((a,b) => a + b));
    };

    const sumThunk = thunk(sum)(input);

    sumThunk((result) => result.should.equal(input.reduce((a,b)=> a + b)));
  });
});
