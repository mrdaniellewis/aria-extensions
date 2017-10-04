/**
 * Custom rules for non-straightforward roles
 */
const ariaExtensions = require('../aria-extensions');

const { symbols } = ariaExtensions;

module.exports = {
  separator: {
    allowedAttributes() {
      const attributes = ['orientation'];

      if (this.node[symbols.focusable]) {
        attributes.push('valuemax', 'valuemin', 'valuenow');
        return ariaExtensions.roleAttributes('widget').concat(attributes).sort();
      }

      return ariaExtensions.roleAttributes('structure').concat(attributes).sort();
    },
  },
};
