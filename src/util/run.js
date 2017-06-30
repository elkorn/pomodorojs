

export
default
function (genFn) {
  // Immediately invoke the generation fn - generator is suspended.
  const gen = genFn();
  const next = (err, value) => {
    if (err) {
      return gen.throw(err);
    }

    const continuation = gen.next(value);

    if (continuation.done) {
      return null;
    }

    const callback = continuation.value;
    callback(next);
    return null;
  };

  // Resume execution of the generator.
  next();
}
