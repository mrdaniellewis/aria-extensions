const Aria = require('./aria');
const { label } = require('./native-label');

module.exports = class AriaProgress extends Aria {
  get implicit() {
    return 'progressbar';
  }

  get allowedRoles() {
    return [];
  }

  get nativeLabel() {
    return label(this.node);
  }
};
