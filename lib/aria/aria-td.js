const Aria = require('./aria');
const ariaExtensions = require('../aria-extensions');

const { symbols } = ariaExtensions;

module.exports = class AriaTd extends Aria {
  get implicit() {
    const role = this.node.closest('table')[symbols.role];
    switch (role) {
      case 'grid':
      case 'treegrid':
        return 'gridcell';
      default:
        return 'cell';
    }
  }
};
