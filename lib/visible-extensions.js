/**
 *  Visible extensions
 */

module.exports = ({ cache, extend, symbols }) => {
  extend(Element.prototype, 'visible', { get() {
    return cache(
      this,
      'visible',
      () => {
        // br / wbr never have dimensions
        if (['br', 'wbr'].includes(this.nodeName.toLowerCase())) {
          return this[symbols.style]('visibility') === 'visible' && !(function isDisplayNone(el) {
            return el instanceof Element && (el[symbols.style]('display') === 'none' || isDisplayNone(el.parentNode));
          }(this));
        }

        // Everything else should have dimensions if being rendered
        // Visibility is inherited from parents
        return this.getClientRects().length !== 0 && this[symbols.style]('visibility') === 'visible';
      }
    );
  } });

  extend(HTMLMapElement.prototype, 'visible', { get() {
    return cache(
      this,
      'visible',
      () => this[symbols.images].some(image => image[symbols.visible])
    );
  } });

  extend(HTMLAreaElement.prototype, 'visible', { get() {
    return cache(
      this,
      'visible',
      () => {
        const map = this.closest('map');
        return !!map && map[symbols.visible];
      }
    );
  } });
};
