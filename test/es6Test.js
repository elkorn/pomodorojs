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

  describe('arrow functions', () => {
    it('SHOULD use expression syntax in simple logic', ()=>{
      let arrow = (a) => a/2;

      arrow(1).should.equal(0.5);
      arrow(2).should.equal(1);
    })
    it('SHOULD not handle expression syntax in complex logic', () =>{
      let arrow = (a) => {
        if(a % 2 === 0) return 'even';
        else return 'odd';
      };

      arrow(1).should.equal('odd');
      arrow(2).should.equal('even');
    });
  });
});
