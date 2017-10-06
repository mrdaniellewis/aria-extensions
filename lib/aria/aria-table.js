const Aria = require('./aria');
const { symbols } = require('../aria-extensions');

module.exports = class AriaTable extends Aria {
  get implicit() {
    return 'table';
  }

  get nativeLabel() {
    return [this.node.caption].filter(node => node[symbols.ariaVisible]);
  }
};
