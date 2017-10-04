const Aria = require('./aria');

module.exports = class AriaMenuitem extends Aria {
  get implicit() {
    switch (this.node.getAttribute('type')) {
      case 'checkbox':
        return 'menuitemcheckbox';
      case 'radio':
        return 'menuitemradio';
      case 'command':
      default:
        return 'menuitem';
    }
  }

  get allowedRoles() {
    return [];
  }
};
