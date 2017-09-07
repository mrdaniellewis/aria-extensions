describe('style extensions', () => {
  it('makes a symbol available on extensions.symbols.style', () => {
    expect(symbols.style.toString()).toEqual('Symbol(aria-extensions-style)');
  });

  describe('#[style]', () => {
    it('returns a style value', () => {
      const node = appendToBody('<div style="color: #f00;">x</div>');
      expect(node[symbols.style]('color')).toEqual('rgb(255, 0, 0)');
    });

    it('returns a pseudo style value', () => {
      appendToBody('<style>.pseudo-test::before { color: #00f; content: "x"; }</style>');
      const node = appendToBody('<div class="pseudo-test">x</div>');
      expect(node[symbols.style]('color', 'before')).toEqual('rgb(0, 0, 255)');
    });

    describe('caching', () => {
      it('can cache the value', () => {
        ariaExtensions.startCaching();
        const node = appendToBody('<div style="color: #f00;">x</div>');
        node[symbols.style]('color');
        const spy = expect.spyOn(window, 'getComputedStyle').andCallThrough();

        expect(node[symbols.style]('color')).toEqual('rgb(255, 0, 0)');
        expect(spy).toNotHaveBeenCalled();
      });

      it('can cache a pseudo value', () => {
        ariaExtensions.startCaching();
        appendToBody('<style>.pseudo-test::before { color: #00f; content: "x"; }</style>');
        const node = appendToBody('<div class="pseudo-test">x</div>');
        node[symbols.style]('color', 'before');
        const spy = expect.spyOn(window, 'getComputedStyle').andCallThrough();

        expect(node[symbols.style]('color', 'before')).toEqual('rgb(0, 0, 255)');
        expect(spy).toNotHaveBeenCalled();
      });
    });
  });
});
