const Aria = require('./aria');

module.exports = class AriaArea extends Aria {
  get implicit() {
    return this.node.href ? 'link' : null;
  }

  get allowedRoles() {
    return [];
  }

  get disallowNone() {
    return !!this.node.href;
  }

  get nativeLabel() {
    return this.node.alt;
  }
};
