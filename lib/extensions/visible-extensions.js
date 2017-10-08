/**
 *  Visible extensions
 */
const ariaExtensions = require('../aria-extensions');
const symbol = require('../symbol');

ariaExtensions[symbol('extend')](Element.prototype, 'visible', {
  get() {
    // br / wbr never have dimensions
    if (['br', 'wbr'].includes(this.nodeName.toLowerCase())) {
      return this[symbol('style')]('visibility') === 'visible' && !(function isDisplayNone(el) {
        return el instanceof Element && (el[symbol('style')]('display') === 'none' || isDisplayNone(el.parentNode));
      }(this));
    }

    // Everything else should have dimensions if being rendered
    // Visibility is inherited from parents
    return this.getClientRects().length !== 0 && this[symbol('style')]('visibility') === 'visible';
  },
});

ariaExtensions[symbol('extend')](HTMLMapElement.prototype, 'visible', {
  get() {
    return this[symbol('images')].some(image => image[symbol('visible')]);
  },
});

ariaExtensions[symbol('extend')](HTMLAreaElement.prototype, 'visible', {
  get() {
    const map = this.closest('map');
    return !!map && map[symbol('visible')];
  },
});

ariaExtensions[symbol('extend')](Element.prototype, 'ariaVisible', {
  get() {
    // aria-hidden=false is ignored due to its lack of compatibility
    return this[symbol('visible')] && (!this.closest('[aria-hidden="true"]') || this[symbol('focusable')]);
  },
});
