const styleExtensions = require('./style-extensions');
const mapExtensions = require('./map-extensions');
const visibleExtensions = require('./visible-extensions');

const namespace = 'aria-extensions';

const cache = Symbol(`${namespace}-cache`);
const cacheMap = Symbol(`${namespace}-cacheMap`);
const extend = Symbol(`${namespace}-extend`);
const extensions = Symbol(`${namespace}-extensions`);

class AriaExtensions {
  constructor(options = {}) {
    this.elements = options.element;
    this.attributes = options.attributes;
    this.symbols = {};
    this[extensions] = [];

    const boundCache = this[cache].bind(this);
    const boundExtend = this[extend].bind(this);

    [styleExtensions, mapExtensions, visibleExtensions].forEach(fn =>
      fn({ cache: boundCache, extend: boundExtend, symbols: this.symbols })
    );
  }

  [extend](target, name, descriptor) {
    const symbol = this.symbols[name] || (this.symbols[name] = Symbol(`${namespace}-${name}`));
    descriptor = Object.assign({ configurable: true }, descriptor);
    Object.defineProperty(target, symbol, descriptor);
    this[extensions].push([target, symbol]);
  }

  [cache](store, key, fn) {
    let hasStore;
    let storeMap;

    if (this[cacheMap]) {
      hasStore = this[cacheMap].has(store);
      if (hasStore && (storeMap = this[cacheMap].get(store)).has(key)) {
        return storeMap.get(key);
      }
    }

    const value = fn();

    if (this[cacheMap]) {
      if (!hasStore) {
        storeMap = new Map();
        this[cacheMap].set(store, storeMap);
      }

      storeMap.set(key, value);
    }

    return value;
  }

  /** Remove all prototype extensions */
  destroy() {
    this[extensions].forEach(([target, symbol]) => delete target[symbol]);
  }

  /** Start caching computed values */
  startCaching() {
    this[cacheMap] = new WeakMap();
  }

  /** Stop caching computed values and discard the values */
  stopCaching() {
    delete this[cacheMap];
  }
}

module.exports = AriaExtensions;
