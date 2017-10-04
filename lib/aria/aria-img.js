const Aria = require('./aria');

module.exports = class AriaImg extends Aria {
  get implicit() {
    return this.node.alt ? 'img' : null;
  }

  get allowedRoles() {
    return this.node.alt
      ? super.allowedRoles.filter(name => !['presentation', 'none'].includes(name))
      : ['none', 'presentation'];
  }

  get allowedAttributes() {
    return this.node.alt
      ? super.allowedAttributes
      : ['hidden'];
  }
};
