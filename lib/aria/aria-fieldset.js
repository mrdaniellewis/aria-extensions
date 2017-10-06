const Aria = require('./aria');
const { firstChild } = require('./native-label');

module.exports = class AriaFieldset extends Aria {
  get allowedRoles() {
    return ['group', 'none', 'presentation'];
  }

  get nativeLabel() {
    return firstChild(this.node, 'legend');
  }
};
