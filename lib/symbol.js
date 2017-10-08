const namespace = 'aria-extensions';
const cache = new Map();

module.exports = name => cache.get(name) || cache.set(name, Symbol(`${namespace}-${name}`)).get(name);
