describe('visible-extensions', () => {
  it('makes a symbol available on extensions.symbols.visible', () => {
    expect(typeof extensions.symbols.visible).toEqual('symbol');
  });

  describe('#visible', () => {
    it('is true for a visible element', () => {
      const node = appendToBody('<div />');
      expect(node[extensions.symbols.visible]).toEqual(true);
    });

    it('is false for an element with display: none', () => {
      const node = appendToBody('<div style="display: none" />');
      expect(node[extensions.symbols.visible]).toEqual(false);
    });

    it('is false for an element with an ancestor with display: none', () => {
      const node = appendToBody('<div style="display: none"><span /></div>').querySelector('span');
      expect(node[extensions.symbols.visible]).toEqual(false);
    });

    it('is false for an element with visibility: hidden', () => {
      const node = appendToBody('<div style="visibility: hidden" />');
      expect(node[extensions.symbols.visible]).toEqual(false);
    });

    it('is false for an element with an ancestor with visibility: hidden', () => {
      const node = appendToBody('<div style="visibility: hidden" />');
      expect(node[extensions.symbols.visible]).toEqual(false);
    });

    it('is false for an element with visibility: collapse', () => {
      const node = appendToBody('<table><tr style="visibility:collapse"><td>foo</table>').querySelector('tr');
      expect(node[extensions.symbols.visible]).toEqual(false);
    });

    it('is false for an element with an ancestor with visibility: collapse', () => {
      const node = appendToBody('<table><tr style="visibility:collapse"><td>foo</table>').querySelector('td');
      expect(node[extensions.symbols.visible]).toEqual(false);
    });

    ['br', 'wbr'].forEach((name) => {
      describe(`${name} elements`, () => {
        it('is true for a visible element', () => {
          const node = appendToBody(`<${name} />`);
          expect(node[extensions.symbols.visible]).toEqual(true);
        });

        it('is false for an element with display: none', () => {
          const node = appendToBody(`<${name} style="display: none" />`);
          expect(node[extensions.symbols.visible]).toEqual(false);
        });

        it('is false for an element with an ancestor with display: none', () => {
          const node = appendToBody(`<div style="display: none"><${name} /></div>`).querySelector(name);
          expect(node[extensions.symbols.visible]).toEqual(false);
        });

        it('is false for an element with visibility: hidden', () => {
          const node = appendToBody(`<${name} style="visibility: hidden" />`);
          expect(node[extensions.symbols.visible]).toEqual(false);
        });

        it('is false for an element with an ancestor with visibility: hidden', () => {
          const node = appendToBody(`<div style="visibility: hidden"><${name} /></div>`).querySelector(name);
          expect(node[extensions.symbols.visible]).toEqual(false);
        });

        it('is false for an element with an ancestor with visibility: collapse', () => {
          const node = appendToBody(`<table><tr style="visibility: collapse"><td><${name} /></table>`).querySelector(name);
          expect(node[extensions.symbols.visible]).toEqual(false);
        });
      });
    });

    describe('map elements', () => {
      it('is false for an element with no image', () => {
        const node = appendToBody('<map />');
        expect(node[extensions.symbols.visible]).toEqual(false);
      });

      it('is false for an element with a hidden image', () => {
        appendToBody('<img usemap="#map" style="display: none" src="flower.jpg" />');
        const node = appendToBody('<map name="map" />');
        expect(node[extensions.symbols.visible]).toEqual(false);
      });

      it('is true for an element with at least one visible image', () => {
        appendToBody('<img usemap="#map" style="display: none" src="flower.jpg" />');
        appendToBody('<img usemap="#map" src="flower.jpg" />');
        const node = appendToBody('<map name="map" />');
        expect(node[extensions.symbols.visible]).toEqual(true);
      });
    });

    describe('area elements', () => {
      it('is false for an element with no map', () => {
        const node = appendToBody('<area />');
        expect(node[extensions.symbols.visible]).toEqual(false);
      });

      it('is false for an element with an unused map', () => {
        const node = appendToBody('<map><area /></map>').querySelector('area');
        expect(node[extensions.symbols.visible]).toEqual(false);
      });

      it('is true for an element with a visible map', () => {
        appendToBody('<img usemap="#map" src="flower.jpg" />');
        const node = appendToBody('<map name="map"><area /></map>').querySelector('area');
        expect(node[extensions.symbols.visible]).toEqual(true);
      });
    });

    describe('caching', () => {
      it('caches the value', () => {
        extensions.startCaching();
        const node = appendToBody('<div />');
        expect(node[extensions.symbols.visible]).toEqual(true);
        node.style.display = 'none';
        expect(node[extensions.symbols.visible]).toEqual(true);
      });

      it('caches the value for map elements', () => {
        extensions.startCaching();
        const image = appendToBody('<img usemap="#map" src="flower.jpg" />');
        const node = appendToBody('<map name="map" />');
        expect(node[extensions.symbols.visible]).toEqual(true);
        image.useMap = '';
        expect(node[extensions.symbols.visible]).toEqual(true);
      });

      it('caches the value for area elements', () => {
        extensions.startCaching();
        const image = appendToBody('<img usemap="#map" src="flower.jpg" />');
        const node = appendToBody('<map name="map"><area /></map>').querySelector('area');
        expect(node[extensions.symbols.visible]).toEqual(true);
        image.useMap = '';
        expect(node[extensions.symbols.visible]).toEqual(true);
      });
    });

    describe('removing extensions', () => {
      beforeEach(() => extensions.destroy());

      it('removes the extension from nodes', () => {
        const node = appendToBody('<div />');
        expect(node[extensions.symbols.visible]).toEqual(undefined);
      });

      it('removes the extension from map elements', () => {
        const node = appendToBody('<map />');
        expect(node[extensions.symbols.visible]).toEqual(undefined);
      });

      it('removes the extension from area elements', () => {
        const node = appendToBody('<area />');
        expect(node[extensions.symbols.visible]).toEqual(undefined);
      });
    });
  });
});
