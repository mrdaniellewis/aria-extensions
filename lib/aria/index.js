import Aria from './aria';
import customElements from './custom-elements';

Aria.create = function create(el) {
  const Klass = customElements[el.nodeName.toLowerCase()] || Aria;
  return new Klass(el);
};

export default Aria;
