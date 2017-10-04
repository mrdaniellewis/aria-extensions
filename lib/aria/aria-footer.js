const Aria = require('./aria');

module.exports = class AriaFooter extends Aria {
  get implicit() {
    return this.node.closest('article,aside,main,nav,section')
      ? null
      : 'contentinfo';
  }

  get allowedRoles() {
    return ['group', 'none', 'presentation'];
  }
};
