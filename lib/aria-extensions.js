const symbol = require('./symbol');
const config = require('aria-config');

function defaultKeygen() {
  return JSON.stringify(Array.from(arguments));
}

const ariaExtensions = {
  [symbol('makeCacheable')](fn, name, keygen) {
    const self = this;

    return function () { // eslint-disable-line func-names
      let key;
      let store;
      if (self[symbol('cacheMap')]) {
        key = `${name}-${keygen.apply(null, arguments)}`;
        store = self[symbol('cacheMap')].get(this);

        if (store && store.has(key)) {
          return store.get(key);
        }
      }

      const value = fn.apply(this, arguments);

      if (self[symbol('cacheMap')]) {
        if (!store) {
          store = new Map();
          self[symbol('cacheMap')].set(this, store);
        }
        store.set(key, value);
      }

      return value;
    };
  },

  [symbol('extend')](target, name, descriptor, { cache = true, keygen = defaultKeygen } = {}) {
    if (cache) {
      const type = descriptor.get ? 'get' : 'value';
      descriptor[type] = this[symbol('makeCacheable')](descriptor[type], name, keygen);
    }
    Object.defineProperty(target, symbol(name), descriptor);
    this.symbols[name] = symbol(name);
  },

  roles: config.roles,
  attributes: config.attributes,

  /** The symbols used to extend the DOM */
  symbols: { cache: symbol('cache') },

  /** Start caching computed values */
  startCaching() {
    this[symbol('cacheMap')] = new WeakMap();
  },

  /** Stop caching computed values and discard the values */
  stopCaching() {
    delete this[symbol('cacheMap')];
  },
};

module.exports = ariaExtensions;
