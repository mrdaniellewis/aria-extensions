describe('style extensions', () => {
  it('makes a symbol available on extensions.symbols.style', () => {
    expect(typeof extensions.symbols.style).toEqual('symbol');
  });

  describe('#style', () => {
    it('returns a style value', () => {
      const node = appendToBody('<div style="color: #f00;">x</div>');
      expect(node[extensions.symbols.style]('color')).toEqual('rgb(255, 0, 0)');
    });

    it('returns a pseudo style value', () => {
      appendToBody('<style>.pseudo-test::before { color: #00f; content: "x"; }</style>');
      const node = appendToBody('<div class="pseudo-test">x</div>');
      expect(node[extensions.symbols.style]('color', 'before')).toEqual('rgb(0, 0, 255)');
    });

    describe('caching', () => {
      it('can cache the value', () => {
        extensions.startCaching();
        const node = appendToBody('<div style="color: #f00;">x</div>');
        node[extensions.symbols.style]('color');
        const spy = expect.spyOn(window, 'getComputedStyle').andCallThrough();

        expect(node[extensions.symbols.style]('color')).toEqual('rgb(255, 0, 0)');
        expect(spy).toNotHaveBeenCalled();
      });

      it('can cache a pseudo value', () => {
        extensions.startCaching();
        appendToBody('<style>.pseudo-test::before { color: #00f; content: "x"; }</style>');
        const node = appendToBody('<div class="pseudo-test">x</div>');
        node[extensions.symbols.style]('color', 'before');
        const spy = expect.spyOn(window, 'getComputedStyle').andCallThrough();

        expect(node[extensions.symbols.style]('color', 'before')).toEqual('rgb(0, 0, 255)');
        expect(spy).toNotHaveBeenCalled();
      });
    });

    describe('removing extensions', () => {
      it('removes the style extension', () => {
        const node = appendToBody('<div />');
        extensions.destroy();
        expect(node[extensions.symbols.style]).toEqual(undefined);
      });
    });
  });
});
