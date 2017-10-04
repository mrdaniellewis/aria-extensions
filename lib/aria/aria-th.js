const Aria = require('./aria');

module.exports = class AriaTh extends Aria {
  get implicit() {
    if (['row', 'rowgroup'].includes(this.node.scope)) {
      return 'rowheader';
    }
    return 'columnheader';
  }
};
