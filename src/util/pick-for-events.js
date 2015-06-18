'use strict';

import pomodoro from '../pomodoro';
import R from 'ramda';

module.exports = {
  pick: R.partial(
    R.pick,
    pomodoro.EVENTS),
  forEach: R.curry(R.flip(R.forEach))(pomodoro.EVENTS)
};
