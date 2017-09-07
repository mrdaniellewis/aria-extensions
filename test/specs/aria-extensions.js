describe('ariaExtension', () => {
  // Clean up any temporary extensions created
  let startingSymbols;
  beforeEach(() => (startingSymbols = Object.keys(symbols)));
  afterEach(() => Object.keys(symbols).forEach((symbol) => {
    if (!startingSymbols.includes(symbol)) {
      delete symbols[symbol];
    }
  }));

  it('is a property of window', () => {
    expect(ariaExtensions).toExist();
  });

  describe('.symbols', () => {
    it('is an object', () => {
      expect(ariaExtensions.symbols).toBeAn(Object);
      expect(symbols).toBe(ariaExtensions.symbols);
    });
  });

  describe('.[extend]', () => {
    const extend = Object.getOwnPropertySymbols(ariaExtensions).find(s => s.toString() === 'Symbol(aria-extensions-extend)');

    it('creates a symbol', () => {
      ariaExtensions[extend]({}, 'foo', { value() { return 'foo'; } });
      expect(symbols.foo.toString()).toEqual('Symbol(aria-extensions-foo)');
    });

    it('extends the object with a value', () => {
      const ob = {};
      ariaExtensions[extend](ob, 'foo', { value() { return 'foo'; } });
      expect(ob[symbols.foo]()).toEqual('foo');
    });

    it('extends the object with a getter', () => {
      const ob = {};
      ariaExtensions[extend](ob, 'foo', { get() { return 'foo'; } });
      expect(ob[symbols.foo]).toEqual('foo');
    });

    it('reuses an existing symbol', () => {
      ariaExtensions[extend]({}, 'foo', { value() { return 'foo'; } });
      const foo = symbols.foo;
      ariaExtensions[extend]({}, 'foo', { value() { return 'foo'; } });
      expect(symbols.foo).toEqual(foo);
    });
  });

  describe('caching', () => {
    const extend = Object.getOwnPropertySymbols(ariaExtensions).find(s => s.toString() === 'Symbol(aria-extensions-extend)');

    it('does not cache values if caching is not turned on', () => {
      const ob = {};
      let count = 0;
      ariaExtensions[extend](ob, 'foo', { get() { return count++; } });
      expect(ob[symbols.foo]).toEqual(0);
      expect(ob[symbols.foo]).toEqual(1);
    });

    it('caches values if caching is turned on', () => {
      ariaExtensions.startCaching();
      const ob = {};
      let count = 0;
      ariaExtensions[extend](ob, 'foo', { value() { return count++; } });
      expect(ob[symbols.foo]()).toEqual(0);
      expect(ob[symbols.foo]()).toEqual(0);
    });

    it('caches getters if caching is turned on', () => {
      ariaExtensions.startCaching();
      const ob = {};
      let count = 0;
      ariaExtensions[extend](ob, 'foo', { get() { return count++; } });
      expect(ob[symbols.foo]).toEqual(0);
      expect(ob[symbols.foo]).toEqual(0);
    });

    it('does not cache values if caching is disabled when extending', () => {
      ariaExtensions.startCaching();
      const ob = {};
      let count = 0;
      ariaExtensions[extend](ob, 'foo', { get() { return count++; } }, { cache: false });
      expect(ob[symbols.foo]).toEqual(0);
      expect(ob[symbols.foo]).toEqual(1);
    });

    it('stops caching values when caching is turned off', () => {
      ariaExtensions.startCaching();
      const ob = {};
      let count = 0;
      ariaExtensions[extend](ob, 'foo', { get() { return count++; } });
      expect(ob[symbols.foo]).toEqual(0);
      ariaExtensions.stopCaching();
      expect(ob[symbols.foo]).toEqual(1);
    });

    it('discards previously cached values when caching is turned off', () => {
      ariaExtensions.startCaching();
      const ob = {};
      let count = 0;
      ariaExtensions[extend](ob, 'foo', { get() { return count++; } });
      expect(ob[symbols.foo]).toEqual(0);
      ariaExtensions.stopCaching();
      ariaExtensions.startCaching();
      expect(ob[symbols.foo]).toEqual(1);
    });

    it('uses independent cache stores', () => {
      ariaExtensions.startCaching();
      const ob1 = {};
      const ob2 = {};
      let count = 0;
      ariaExtensions[extend](ob1, 'foo', { get() { return count++; } });
      ariaExtensions[extend](ob2, 'foo', { get() { return count++; } });
      expect(ob1[symbols.foo]).toEqual(0);
      expect(ob2[symbols.foo]).toEqual(1);
    });

    it('caches using the function name as part of the key', () => {
      ariaExtensions.startCaching();
      const ob = {};
      let count = 0;
      ariaExtensions[extend](ob, 'foo', { get() { return count++; } });
      ariaExtensions[extend](ob, 'bar', { get() { return count++; } });
      expect(ob[symbols.foo]).toEqual(0);
      expect(ob[symbols.bar]).toEqual(1);
    });

    it('caches using the function arguments as part of the key', () => {
      ariaExtensions.startCaching();
      const ob = {};
      let count = 0;
      ariaExtensions[extend](ob, 'foo', { value() { return count++; } });
      expect(ob[symbols.foo]([1])).toEqual(0);
      expect(ob[symbols.foo]([1, 2])).toEqual(1);
    });

    it('caches using a custom key generator', () => {
      ariaExtensions.startCaching();
      const ob = {};
      let count = 0;
      const spy = expect.createSpy().andReturn('key');
      ariaExtensions[extend](ob, 'foo', { value() { return count++; } }, { keygen: spy });
      expect(ob[symbols.foo]('foo')).toEqual(0);
      expect(ob[symbols.foo]('bar')).toEqual(0);
      expect(spy).toHaveHadCalls(['foo'], ['bar']);
    });
  });
});
