const Aria = require('./aria');

module.exports = class AriaLink extends Aria {
  get implicit() {
    return this.node.href ? 'link' : null;
  }

  get allowedRoles() {
    return [];
  }

  get allowedAttributes() {
    return [];
  }
};
