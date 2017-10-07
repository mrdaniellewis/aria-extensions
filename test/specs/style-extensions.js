describe('style extensions', () => {
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
        expect(node[symbols.style]('color')).toEqual('rgb(255, 0, 0)');
        node.style.color = '#000';
        expect(node[symbols.style]('color')).toEqual('rgb(255, 0, 0)');
      });

      it('can cache a pseudo value', () => {
        ariaExtensions.startCaching();
        const style = appendToBody('<style>.pseudo-test::before { color: #00f; content: "x"; }</style>');
        const node = appendToBody('<div class="pseudo-test">x</div>');
        expect(node[symbols.style]('color', 'before')).toEqual('rgb(0, 0, 255)');
        style.remove();
        expect(node[symbols.style]('color', 'before')).toEqual('rgb(0, 0, 255)');
      });
    });
  });
});
