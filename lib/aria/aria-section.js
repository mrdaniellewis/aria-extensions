const Aria = require('./aria');
const ariaExtensions = require('../aria-extensions');
const symbol = require('../symbol');

module.exports = class AriaSection extends Aria {
  get implicit() {
    return new ariaExtensions[symbol('AccessibleName')](this.node, { role: 'region' }).build()
      ? 'region'
      : null;
  }

  get allowedRoles() {
    return ['alert', 'alertdialog', 'application', 'banner', 'complementary', 'contentinfo', 'dialog', 'document', 'feed', 'log', 'main', 'marquee', 'navigation', 'none', 'presentation', 'search', 'status', 'tabpanel'];
  }
};
