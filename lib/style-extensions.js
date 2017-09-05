/**
 *  Style extensions
 */

module.exports = ({ cache, extend }) => {
  extend(Element.prototype, 'style', { value(name, pseudo) {
    return cache(
      this,
      `style~${name}~${pseudo}`,
      () => window.getComputedStyle(this, pseudo ? `::${pseudo}` : null)[name]
    );
  } });
};
