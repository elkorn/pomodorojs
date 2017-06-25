'use strict';

const libnotify = require('libnotify');
const Plugin = require('../util/plugin');


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
