const Aria = require('./aria');
const { label } = require('./native-label');

module.exports = class AriaMeter extends Aria {
  get allowedRoles() {
    return [];
  }

  get nativeLabel() {
    return label(this.node);
  }
};
