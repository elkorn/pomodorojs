'use strict';

import libnotify from 'libnotify';
import Plugin from '../util/plugin';


let notify = (title, message) => {
  libnotify.notify(message, {
    title: title
  });
};

export default class Notifier extends Plugin {
  constructor(messages) {
    this.messages = messages;
    super({

    });
  }


};
