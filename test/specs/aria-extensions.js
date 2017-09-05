describe('AriaExtension', () => {
  it('constructs a new AriaExtensions', () => {
    expect(extensions).toBeAn(AriaExtensions);
  });

  describe('#[cache]', () => {
    const cache = Object.getOwnPropertySymbols(AriaExtensions.prototype).find(s => s.toString() === 'Symbol(aria-extensions-cache)');

    it('always calculates the value if caching is turned off', () => {
      let count = 0;
      const spy = expect.createSpy().andCall(() => ++count);
      const store = {};

      expect(extensions[cache](store, 'key', spy)).toEqual(1);
      expect(extensions[cache](store, 'key', spy)).toEqual(2);
      expect(spy.calls.length).toEqual(2);
    });

    it('caches the value if caching is turned on', () => {
      let count = 0;
      const spy = expect.createSpy().andCall(() => ++count);
      const store = {};

      extensions.startCaching();

      expect(extensions[cache](store, 'key', spy)).toEqual(1);
      expect(extensions[cache](store, 'key', spy)).toEqual(1);
      expect(spy.calls.length).toEqual(1);
    });

    it('caches keys independently', () => {
      let count = 0;
      const spy = expect.createSpy().andCall(() => ++count);
      const store = {};

      extensions.startCaching();

      expect(extensions[cache](store, 'key1', spy)).toEqual(1);
      expect(extensions[cache](store, 'key2', spy)).toEqual(2);
      expect(extensions[cache](store, 'key1', spy)).toEqual(1);
      expect(extensions[cache](store, 'key2', spy)).toEqual(2);
      expect(spy.calls.length).toEqual(2);
    });

    it('caches stores independently', () => {
      let count = 0;
      const spy = expect.createSpy().andCall(() => ++count);
      const store1 = {};
      const store2 = {};

      extensions.startCaching();

      expect(extensions[cache](store1, 'key', spy)).toEqual(1);
      expect(extensions[cache](store2, 'key', spy)).toEqual(2);
      expect(extensions[cache](store1, 'key', spy)).toEqual(1);
      expect(extensions[cache](store2, 'key', spy)).toEqual(2);
      expect(spy.calls.length).toEqual(2);
    });

    it('stops caching the value when caching is turned off', () => {
      let count = 0;
      const spy = expect.createSpy().andCall(() => ++count);
      const store = {};

      extensions.startCaching();
      expect(extensions[cache](store, 'key', spy)).toEqual(1);

      extensions.stopCaching();
      expect(extensions[cache](store, 'key', spy)).toEqual(2);
      expect(spy.calls.length).toEqual(2);
    });

    it('discards previous cached values if caching is re-enabled', () => {
      let count = 0;
      const spy = expect.createSpy().andCall(() => ++count);
      const store = {};

      extensions.startCaching();
      expect(extensions[cache](store, 'key', spy)).toEqual(1);

      extensions.stopCaching();
      expect(extensions[cache](store, 'key', spy)).toEqual(2);

      extensions.startCaching();
      expect(extensions[cache](store, 'key', spy)).toEqual(3);
      expect(extensions[cache](store, 'key', spy)).toEqual(3);

      expect(spy.calls.length).toEqual(3);
    });
  });

  describe('#[extend]', () => {
    const extend = Object.getOwnPropertySymbols(AriaExtensions.prototype).find(s => s.toString() === 'Symbol(aria-extensions-extend)');

    it('creates a symbol', () => {
      extensions[extend]({}, 'foo', { value: 'bar' });
      expect(extensions.symbols.foo.toString()).toEqual('Symbol(aria-extensions-foo)');
    });

    it('extends an object with a function', () => {
      const ob = { bar: 'bar' };

      extensions[extend](ob, 'foo', { value() { return this.bar; } });

      expect(ob[extensions.symbols.foo]()).toEqual('bar');
      expect(Object.getOwnPropertyDescriptor(ob, extensions.symbols.foo)).toContain({
        enumerable: false,
        configurable: true,
        writable: false,
      });
    });

    it('extends an object with a getter', () => {
      const ob = { bar: 'bar' };

      extensions[extend](ob, 'foo', { get() { return this.bar; } });

      expect(ob[extensions.symbols.foo]).toEqual('bar');
      expect(Object.getOwnPropertyDescriptor(ob, extensions.symbols.foo)).toContain({
        enumerable: false,
        configurable: true,
        set: undefined,
      });
    });
  });

  describe('destroy', () => {
    const extend = Object.getOwnPropertySymbols(AriaExtensions.prototype).find(s => s.toString() === 'Symbol(aria-extensions-extend)');

    it('removes any extensions', () => {
      const ob = {};

      extensions[extend](ob, 'foo', { value() { return 'foo'; } });
      extensions[extend](ob, 'bar', { get() { return 'bar'; } });

      expect(ob[extensions.symbols.foo]()).toEqual('foo');
      expect(ob[extensions.symbols.bar]).toEqual('bar');

      extensions.destroy();

      expect(ob[extensions.symbols.foo]).toEqual(undefined);
      expect(ob[extensions.symbols.bar]).toEqual(undefined);
    });
  });
});
