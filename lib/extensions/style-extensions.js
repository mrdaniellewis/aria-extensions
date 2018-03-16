/**
 *  Style extensions
 */

import ariaExtensions from '../aria-extensions';
import symbol from '../symbol';

ariaExtensions[symbol('extend')](Element.prototype, 'style', {
  value(name, pseudo) {
    return window.getComputedStyle(this, pseudo ? `::${pseudo}` : null)[name];
  },
});
