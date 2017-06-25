'use strict';

export
default
function(genFn) {
  // Immediately invoke the generation fn - generator is suspended.
  let gen = genFn();
  let next = (err, value) => {
    if (err) {
      return gen.throw(err);
    }

    let continuation = gen.next(value);

    if (continuation.done) {
      return null;
    }

    let callback = continuation.value;
    callback(next);
    return null;
  };

  // Resume execution of the generator.
  next();
}
