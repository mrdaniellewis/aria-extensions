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
