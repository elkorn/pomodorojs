'use strict';

import thunk from '../src/util/thunk';

describe('Thunk', ()=>{
  it('SHOULD convert any function into a thunk', ()=>{
    let input = [1,2,3];
    let sum = (arr, callback) => {
      callback(arr.reduce((a,b) => a + b));
    };

    let sumThunk = thunk(sum)(input);

    sumThunk((result) => result.should.equal(input.reduce((a,b)=> a + b)));
  });
});
