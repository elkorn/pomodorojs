

const pomodoro = require('../core');
const R = require('ramda');

const keys = R.keys(pomodoro.EVENTS);

module.exports = {
  pick: R.partial(R.pick, keys),
  forEach: R.curry(R.flip(R.forEach))(keys),
};
