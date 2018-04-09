describe('map extensions', () => {
  describe('#[images]', () => {
    it('returns an empty array if no images are using an imagemap', () => {
      appendToBody('<img src="flower.jpg" />');
      const node = appendToBody('<map />');

      expect(node[symbols.images]).toEqual([]);
    });

    it('returns images using a map', () => {
      const image1 = appendToBody('<img usemap="#map" src="flower.jpg" />');
      const image2 = appendToBody('<img usemap="#map" src="flower.jpg" />');
      const node = appendToBody('<map name="map"/>');

      expect(node[symbols.images]).toEqual([image1, image2]);
    });

    it('returns images case insensitively', () => {
      const image = appendToBody('<img usemap="#MaP" src="flower.jpg" />');
      const node = appendToBody('<map name="map"/>');

      expect(node[symbols.images]).toEqual([image]);
    });

    describe('caching', () => {
      it('caches the value', () => {
        ariaExtensions.startCaching();

        const image = appendToBody('<img usemap="#map" src="flower.jpg" />');
        const node = appendToBody('<map name="map"/>');

        expect(node[symbols.images]).toEqual([image]);
        image.useMap = '';
        expect(node[symbols.images]).toEqual([image]);
      });
    });
  });

  describe('#[imageMap]', () => {
    it('return null with no useMap', () => {
      const node = appendToBody('<img src="flower.jpg" />');
      expect(node[symbols.imageMap]).toEqual(null);
    });

    it('return null if useMap has no valid target', () => {
      const id = uniqueId();
      const node = appendToBody(`<img src="flower.jpg" usemap="#${id}" />`);
      expect(node[symbols.imageMap]).toEqual(null);
    });

    it('return the map with a valid target', () => {
      const id = uniqueId();
      const node = appendToBody(`<img src="flower.jpg" usemap="#${id}" />`);
      const map = appendToBody(`<map name="${id}"><area /></map>`);
      expect(node[symbols.imageMap]).toEqual(map);
    });

    it('return the map case insensitively with a valid target', () => {
      const id = uniqueId();
      const node = appendToBody(`<img src="flower.jpg" usemap="#${id}x" />`);
      const map = appendToBody(`<map name="${id}X"><area /></map>`);
      expect(node[symbols.imageMap]).toEqual(map);
    });

    describe('caching', () => {
      it('caches the value', () => {
        ariaExtensions.startCaching();

        const id = uniqueId();
        const node = appendToBody(`<img src="flower.jpg" usemap="#${id}" />`);
        const map = appendToBody(`<map name="${id}"><area /></map>`);
        expect(node[symbols.imageMap]).toEqual(map);
        map.name = uniqueId();
        expect(node[symbols.imageMap]).toEqual(map);
      });
    });
  });
});
