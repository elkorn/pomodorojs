var should = require('should');

describe('ES6 features', () => {
  describe('rest/spread', () => {
    it('SHOULD concatenate', () => {
      function fn(a, ...rest) {
        return rest.concat([a]);
      }

      fn(4, 1, 2, 3).should.eql([1, 2, 3, 4]);
    });
  });
});
