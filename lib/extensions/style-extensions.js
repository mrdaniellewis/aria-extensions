/**
 *  Style extensions
 */

const ariaExtensions = require('../aria-extensions');
const symbol = require('../symbol');

ariaExtensions[symbol('extend')](Element.prototype, 'style', {
  value(name, pseudo) {
    return window.getComputedStyle(this, pseudo ? `::${pseudo}` : null)[name];
  },
});
