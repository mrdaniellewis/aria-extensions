const ariaExtensions = require('../../aria-extensions');

module.exports = {
  implicit() {
    return this.href ? 'link' : null;
  },

  allowedRoles() {
    return this.href
      ? 'link'
      : ariaExtensions[anyRole];
  },
};
