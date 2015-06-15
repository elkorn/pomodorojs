'use strict';

export default function(fn) {
  return function(...args) {
    return function(callback) {
      fn.apply(this, args.concat([callback]));
    };
  };
};
