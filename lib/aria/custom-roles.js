/**
 * Custom rules for non-straightforward roles
 */
import ariaExtensions from '../aria-extensions';
import symbol from '../symbol';

export default {
  separator: {
    allowedAttributes() {
      const attributes = ['orientation'];

      if (this.node[symbol('focusable')]) {
        attributes.push('valuemax', 'valuemin', 'valuenow');
        return ariaExtensions.roleAttributes('widget').concat(attributes).sort();
      }

      return ariaExtensions.roleAttributes('structure').concat(attributes).sort();
    },
  },
};
