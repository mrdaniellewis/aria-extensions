const Aria = require('./aria');
const symbol = require('../symbol');

module.exports = class AriaTd extends Aria {
  get implicit() {
    const role = this.node.closest('table')[symbol('role')];
    switch (role) {
      case 'grid':
      case 'treegrid':
        return 'gridcell';
      default:
        return 'cell';
    }
  }
};
