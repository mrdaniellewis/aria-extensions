describe('map extensions', () => {
  it('makes a symbol available on extensions.symbols.images', () => {
    expect(typeof extensions.symbols.images).toEqual('symbol');
  });

  describe('#images', () => {
    it('returns an empty array if no images are using an imagemap', () => {
      appendToBody('<img src="flower.jpg" />');
      const node = appendToBody('<map />');

      expect(node[extensions.symbols.images]).toEqual([]);
    });

    it('returns images using a map', () => {
      const image1 = appendToBody('<img usemap="#map" src="flower.jpg" />');
      const image2 = appendToBody('<img usemap="#map" src="flower.jpg" />');
      const node = appendToBody('<map name="map"/>');

      expect(node[extensions.symbols.images]).toEqual([image1, image2]);
    });

    it('returns images case insensitively', () => {
      const image = appendToBody('<img usemap="#MaP" src="flower.jpg" />');
      const node = appendToBody('<map name="map"/>');

      expect(node[extensions.symbols.images]).toEqual([image]);
    });

    describe('caching', () => {
      it('caches the value', () => {
        extensions.startCaching();

        const image = appendToBody('<img usemap="#map" src="flower.jpg" />');
        const node = appendToBody('<map name="map"/>');

        expect(node[extensions.symbols.images]).toEqual([image]);
        image.useMap = '';
        expect(node[extensions.symbols.images]).toEqual([image]);
      });
    });

    describe('removing extensions', () => {
      it('removes the images extension', () => {
        const node = appendToBody('<map name="map"/>');
        extensions.destroy();
        expect(node[extensions.symbols.images]).toEqual(undefined);
      });
    });
  });
});
