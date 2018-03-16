describe('visible-extensions', () => {
  describe('#[visible]', () => {
    it('is true for a visible element', () => {
      const node = appendToBody('<div />');
      expect(node[symbols.visible]).toEqual(true);
    });

    it('is false for an element with display: none', () => {
      const node = appendToBody('<div style="display: none" />');
      expect(node[symbols.visible]).toEqual(false);
    });

    it('is false for an element with an ancestor with display: none', () => {
      const node = appendToBody('<div style="display: none"><span /></div>').querySelector('span');
      expect(node[symbols.visible]).toEqual(false);
    });

    it('is false for an element with visibility: hidden', () => {
      const node = appendToBody('<div style="visibility: hidden" />');
      expect(node[symbols.visible]).toEqual(false);
    });

    it('is false for an element with an ancestor with visibility: hidden', () => {
      const node = appendToBody('<div style="visibility: hidden" />');
      expect(node[symbols.visible]).toEqual(false);
    });

    it('is false for an element with visibility: collapse', () => {
      const node = appendToBody('<table><tr style="visibility:collapse"><td>foo</table>').querySelector('tr');
      expect(node[symbols.visible]).toEqual(false);
    });

    it('is false for an element with an ancestor with visibility: collapse', () => {
      const node = appendToBody('<table><tr style="visibility:collapse"><td>foo</table>').querySelector('td');
      expect(node[symbols.visible]).toEqual(false);
    });

    ['br', 'wbr'].forEach((name) => {
      describe(`${name} elements`, () => {
        it('is true for a visible element', () => {
          const node = appendToBody(`<${name} />`);
          expect(node[symbols.visible]).toEqual(true);
        });

        it('is false for an element with display: none', () => {
          const node = appendToBody(`<${name} style="display: none" />`);
          expect(node[symbols.visible]).toEqual(false);
        });

        it('is false for an element with an ancestor with display: none', () => {
          const node = appendToBody(`<div style="display: none"><${name} /></div>`).querySelector(name);
          expect(node[symbols.visible]).toEqual(false);
        });

        it('is false for an element with visibility: hidden', () => {
          const node = appendToBody(`<${name} style="visibility: hidden" />`);
          expect(node[symbols.visible]).toEqual(false);
        });

        it('is false for an element with an ancestor with visibility: hidden', () => {
          const node = appendToBody(`<div style="visibility: hidden"><${name} /></div>`).querySelector(name);
          expect(node[symbols.visible]).toEqual(false);
        });

        it('is false for an element with an ancestor with visibility: collapse', () => {
          const node = appendToBody(`<table><tr style="visibility: collapse"><td><${name} /></table>`).querySelector(name);
          expect(node[symbols.visible]).toEqual(false);
        });
      });
    });

    describe('map elements', () => {
      it('is false for an element with no image', () => {
        const node = appendToBody('<map />');
        expect(node[symbols.visible]).toEqual(false);
      });

      it('is false for an element with a hidden image', () => {
        appendToBody('<img usemap="#map" style="display: none" src="flower.jpg" />');
        const node = appendToBody('<map name="map" />');
        expect(node[symbols.visible]).toEqual(false);
      });

      it('is true for an element with at least one visible image', () => {
        appendToBody('<img usemap="#map" style="display: none" src="flower.jpg" />');
        appendToBody('<img usemap="#map" src="flower.jpg" />');
        const node = appendToBody('<map name="map" />');
        expect(node[symbols.visible]).toEqual(true);
      });
    });

    describe('area elements', () => {
      it('is false for an element with no map', () => {
        const node = appendToBody('<area />');
        expect(node[symbols.visible]).toEqual(false);
      });

      it('is false for an element with an unused map', () => {
        const node = appendToBody('<map><area /></map>').querySelector('area');
        expect(node[symbols.visible]).toEqual(false);
      });

      it('is true for an element with a visible map', () => {
        appendToBody('<img usemap="#map" src="flower.jpg" />');
        const node = appendToBody('<map name="map"><area /></map>').querySelector('area');
        expect(node[symbols.visible]).toEqual(true);
      });
    });

    describe('caching', () => {
      it('caches the value', () => {
        ariaExtensions.startCaching();
        const node = appendToBody('<div />');
        expect(node[symbols.visible]).toEqual(true);
        node.style.display = 'none';
        expect(node[symbols.visible]).toEqual(true);
      });

      it('caches the value for map elements', () => {
        ariaExtensions.startCaching();
        const image = appendToBody('<img usemap="#map" src="flower.jpg" />');
        const node = appendToBody('<map name="map" />');
        expect(node[symbols.visible]).toEqual(true);
        image.useMap = '';
        expect(node[symbols.visible]).toEqual(true);
      });

      it('caches the value for area elements', () => {
        ariaExtensions.startCaching();
        const image = appendToBody('<img usemap="#map" src="flower.jpg" />');
        const node = appendToBody('<map name="map"><area /></map>').querySelector('area');
        expect(node[symbols.visible]).toEqual(true);
        image.useMap = '';
        expect(node[symbols.visible]).toEqual(true);
      });
    });
  });

  describe('#[ariaVisible]', () => {
    it('is true for a visible element', () => {
      const node = appendToBody('<div>foo</div>');
      expect(node[symbols.ariaVisible]).toEqual(true);
    });

    it('is false for an invisible element', () => {
      const node = appendToBody('<div hidden>foo</div>');
      expect(node[symbols.ariaVisible]).toEqual(false);
    });

    it('is false for a visible element with aria-hidden="true"', () => {
      const node = appendToBody('<div aria-hidden="true">foo</div>');
      expect(node[symbols.ariaVisible]).toEqual(false);
    });

    it('is false for a visible element with an ancestor aria-hidden="true"', () => {
      const node = appendToBody('<div aria-hidden="true"><span>foo</span></div>').querySelector('span');
      expect(node[symbols.ariaVisible]).toEqual(false);
    });

    it('is false for a visible element with an ancestor aria-hidden="true" even if aria-hidden="false"', () => {
      const node = appendToBody('<div aria-hidden="true"><span aria-hidden="false">foo</span></div>').querySelector('span');
      expect(node[symbols.ariaVisible]).toEqual(false);
    });

    it('is true for an aria-hidden element that is focusable', () => {
      const node = appendToBody('<button aria-hidden="true">foo</button>');
      expect(node[symbols.ariaVisible]).toEqual(true);
    });

    it('is true for an aria-hidden element that is focusable', () => {
      const node = appendToBody('<button aria-hidden="true">foo</button>');
      expect(node[symbols.ariaVisible]).toEqual(true);
    });

    describe('caching', () => {
      it('caches the value', () => {
        ariaExtensions.startCaching();
        const node = appendToBody('<div />');
        expect(node[symbols.ariaVisible]).toEqual(true);
        node.style.display = 'none';
        expect(node[symbols.ariaVisible]).toEqual(true);
      });
    });
  });
});
