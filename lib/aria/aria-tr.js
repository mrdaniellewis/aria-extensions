const Aria = require('./aria');
const ariaExtensions = require('../aria-extensions');

const { symbols } = ariaExtensions;

module.exports = class AriaTr extends Aria {
  get implicit() {
    return this.node.closest('table')[symbols.hasRole]('table')
      ? 'row'
      : null;
  }
};
