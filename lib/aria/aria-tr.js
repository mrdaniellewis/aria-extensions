const Aria = require('./aria');
const symbol = require('../symbol');

module.exports = class AriaTr extends Aria {
  get implicit() {
    return this.node.closest('table')[symbol('hasRole')]('table')
      ? 'row'
      : null;
  }
};
