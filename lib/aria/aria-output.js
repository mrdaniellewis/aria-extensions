const Aria = require('./aria');
const { label } = require('./native-label');

module.exports = class AriaOutput extends Aria {
  get implicit() {
    return 'status';
  }

  get nativeLabel() {
    return label(this.node);
  }
};
