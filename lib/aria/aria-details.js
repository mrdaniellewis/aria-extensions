const Aria = require('./aria');
const { firstChild } = require('./native-label');

module.exports = class AriaDetails extends Aria {
  get implicit() {
    return 'group';
  }

  get allowedRoles() {
    return [];
  }

  get nativeLabel() {
    return firstChild(this.node, 'summary');
  }
};
