mocha.setup('bdd');

// Helpful shortcut
window.symbols = ariaExtensions.symbols;
window.appendToBody = domUtils.appendToBody;
window.uniqueId = domUtils.uniqueId;

// Remove any created DOM nodes
domUtils.cleanDom();
// Ensure each test has expectations
expect.hasAssertions();
// Clean up spies
afterEach(() => mock.clearAllMocks());
// Stop caching if caching has been started
afterEach(() => ariaExtensions.stopCaching());

// Find a symbol on an object
window.findSymbol = (ob, name) => Object.getOwnPropertySymbols(ob).find(s => s.toString() === `Symbol(${name})`);

// Improved array manipulation
window.ExtendedArray = class ExtendedArray extends Array {
  not(...values) {
    return this.filter(value => !values.includes(value));
  }
};

expect.extend({
  toIncludeProperties(actual, expected) {
    Object.entries(expected).forEach(([name, entry]) => {
      if (Array.isArray(expected[name])) {
        expect(entry).toMatchArray(actual[name]);
      } else {
        expect(entry).toEqual(actual[name]);
      }
    });
    return { pass: true };
  },
});
