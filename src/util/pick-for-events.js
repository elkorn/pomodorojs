'use strict';

const pomodoro = require('../pomodoro');
const R = require('ramda');

const keys = R.keys(pomodoro.EVENTS);

module.exports = {
  pick: R.partial(R.pick, keys),
  forEach: R.curry(R.flip(R.forEach))(keys)
};
