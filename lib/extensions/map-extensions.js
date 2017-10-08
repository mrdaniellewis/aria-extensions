/**
 *  Extensions for imagemap
 */

const { extend } = require('../constants');
const ariaExtensions = require('../aria-extensions');

ariaExtensions[extend](HTMLMapElement.prototype, 'images', {
  get() {
    return Array.from(document.querySelectorAll(`[usemap="#${this.name}" i]`));
  },
});
