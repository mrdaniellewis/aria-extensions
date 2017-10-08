/**
 *  Extensions for imagemap
 */

const ariaExtensions = require('../aria-extensions');
const symbol = require('../symbol');

ariaExtensions[symbol('extend')](HTMLMapElement.prototype, 'images', {
  get() {
    return Array.from(document.querySelectorAll(`[usemap="#${this.name}" i]`));
  },
});
