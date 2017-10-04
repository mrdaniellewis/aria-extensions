const Aria = require('./aria');
const customElements = require('./custom-elements.js');

Aria.create = function create(el) {
  const Klass = customElements[el.nodeName.toLowerCase()] || Aria;
  return new Klass(el);
};

module.exports = Aria;
