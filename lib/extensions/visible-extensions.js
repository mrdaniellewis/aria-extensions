/**
 *  Visible extensions
 */
const { extend } = require('../constants');
const ariaExtensions = require('../aria-extensions');

const { symbols } = ariaExtensions;

ariaExtensions[extend](Element.prototype, 'visible', {
  get() {
    // br / wbr never have dimensions
    if (['br', 'wbr'].includes(this.nodeName.toLowerCase())) {
      return this[symbols.style]('visibility') === 'visible' && !(function isDisplayNone(el) {
        return el instanceof Element && (el[symbols.style]('display') === 'none' || isDisplayNone(el.parentNode));
      }(this));
    }

    // Everything else should have dimensions if being rendered
    // Visibility is inherited from parents
    return this.getClientRects().length !== 0 && this[symbols.style]('visibility') === 'visible';
  },
});

ariaExtensions[extend](HTMLMapElement.prototype, 'visible', {
  get() {
    return this[symbols.images].some(image => image[symbols.visible]);
  },
});

ariaExtensions[extend](HTMLAreaElement.prototype, 'visible', {
  get() {
    const map = this.closest('map');
    return !!map && map[symbols.visible];
  },
});

ariaExtensions[extend](Element.prototype, 'ariaVisible', {
  get() {
    // aria-hidden=false is ignored due to its lack of compatibility
    return this[symbols.visible] && (!this.closest('[aria-hidden="true"]') || this[symbols.focusable]);
  },
});
