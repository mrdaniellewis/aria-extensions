/**
 *  Style extensions
 */

const { extend } = require('./constants');
const ariaExtensions = require('./aria-extensions');

ariaExtensions[extend](Element.prototype, 'style', { value(name, pseudo) {
  return window.getComputedStyle(this, pseudo ? `::${pseudo}` : null)[name];
} });
