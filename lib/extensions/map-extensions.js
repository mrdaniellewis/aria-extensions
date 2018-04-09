/**
 *  Extensions for imagemap
 */

import ariaExtensions from '../aria-extensions';
import symbol from '../symbol';

ariaExtensions[symbol('extend')](HTMLMapElement.prototype, 'images', {
  get() {
    return Array.from(document.querySelectorAll(`[usemap="#${this.name}" i]`));
  },
});

ariaExtensions[symbol('extend')](HTMLImageElement.prototype, 'imageMap', {
  get() {
    if (!this.useMap) {
      return null;
    }
    return document.querySelector(`[name="${CSS.escape(this.useMap.replace(/^#/, ''))}" i]`);
  },
});
