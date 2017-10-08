const Aria = require('./aria');
const symbol = require('../symbol');

module.exports = class AriaTable extends Aria {
  get implicit() {
    return 'table';
  }

  get nativeLabel() {
    return [this.node.caption].filter(node => node[symbol('ariaVisible')]);
  }
};
