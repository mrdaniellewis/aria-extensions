const { namespace, extend } = require('./constants');

const makeCacheable = Symbol(`${namespace}-makeCacheable`);
const cacheMap = Symbol(`${namespace}-cacheMap`);

function defaultKeygen() {
  return Array.from(arguments).map(v => String(v)).join('~');
}

const ariaExtensions = {
  [makeCacheable](fn, name, keygen) {
    const self = this;

    return function () { // eslint-disable-line func-names
      let key;
      let store;
      if (self[cacheMap]) {
        key = `${name}-${keygen.apply(null, arguments)}`;
        store = self[cacheMap].get(this);

        if (store && store.has(key)) {
          return store.get(key);
        }
      }

      const value = fn.apply(this, arguments);

      if (self[cacheMap]) {
        if (!store) {
          store = new Map();
          self[cacheMap].set(this, store);
        }
        store.set(key, value);
      }

      return value;
    };
  },

  [extend](target, name, descriptor, { cache = true, keygen = defaultKeygen } = {}) {
    const symbol = this.symbols[name] || (this.symbols[name] = Symbol(`${namespace}-${name}`));

    if (cache) {
      const type = descriptor.get ? 'get' : 'value';
      descriptor[type] = this[makeCacheable](descriptor[type], name, keygen);
    }

    Object.defineProperty(target, symbol, descriptor);
  },

  /** The symbols used to extend the DOM */
  symbols: {},

  /** Start caching computed values */
  startCaching() {
    this[cacheMap] = new WeakMap();
  },

  /** Stop caching computed values and discard the values */
  stopCaching() {
    delete this[cacheMap];
  },
};

module.exports = ariaExtensions;
