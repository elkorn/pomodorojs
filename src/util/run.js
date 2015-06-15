'use strict';

export default function(genFn) {
  let next = (err, value) => {
    if(err) return gen.throw(err);

    let continuation = gen.next(value);

    if(continuation.done) return null;

    let callback = continuation.value;
    console.log(next.toString(), callback.toString());
    callback(next);
    return null;
  };

  // Immediately invoke the generation fn - generator is suspended.
  let gen = genFn();

  // Resume execution of the generator.
  next();
};
