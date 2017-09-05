/**
 *  Extensions for imagemap
 */

module.exports = ({ cache, extend }) => {
  extend(HTMLMapElement.prototype, 'images', { get() {
    return cache(
      this,
      'images',
      () => Array.from(document.querySelectorAll(`[usemap="#${this.name}" i]`))
    );
  } });
};
