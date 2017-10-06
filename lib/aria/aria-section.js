const Aria = require('./aria');
const ariaExtensions = require('../aria-extensions');
const { AccessibleName } = require('../constants');

module.exports = class AriaSection extends Aria {
  get implicit() {
    return new ariaExtensions[AccessibleName](this.node, { role: 'region' }).build()
      ? 'region'
      : null;
  }

  get allowedRoles() {
    return ['alert', 'alertdialog', 'application', 'banner', 'complementary', 'contentinfo', 'dialog', 'document', 'feed', 'log', 'main', 'marquee', 'navigation', 'none', 'presentation', 'search', 'status', 'tabpanel'];
  }
};
