/**
 * Custom rules for non-straightforward roles
 */
const ariaExtensions = require('../aria-extensions');
const symbol = require('../symbol');

module.exports = {
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
