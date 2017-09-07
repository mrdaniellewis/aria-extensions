describe('contrast-extensions', () => {
  it('makes a symbol available on symbols.contrast', () => {
    expect(symbols.contrast.toString()).toEqual('Symbol(aria-extensions-contrast)');
  });

  describe('.[luminosity]', () => {
    const luminosity = findSymbol(ariaExtensions, 'aria-extensions-luminosity');

    it('is 0 for black', () => {
      expect(ariaExtensions[luminosity](0, 0, 0)).toEqual(0);
    });

    it('is 1 for white', () => {
      expect(ariaExtensions[luminosity](255, 255, 255)).toEqual(1);
    });

    it('is 0.2126 for red', () => {
      expect(ariaExtensions[luminosity](255, 0, 0)).toEqual(0.2126);
    });

    it('is 0.7152 for green', () => {
      expect(ariaExtensions[luminosity](0, 255, 0)).toEqual(0.7152);
    });

    it('is 0.0722 for blue', () => {
      expect(ariaExtensions[luminosity](0, 0, 255)).toEqual(0.0722);
    });

    it('is correct for 1% grey', () => {
      expect(ariaExtensions[luminosity](255 * 0.01, 255 * 0.01, 255 * 0.01).toFixed(4)).toEqual('0.0008');
    });

    it('is correct for 50% grey', () => {
      expect(ariaExtensions[luminosity](255 * 0.5, 255 * 0.5, 255 * 0.5).toFixed(4)).toEqual('0.2140');
    });
  });

  describe('.[contrastRatio]', () => {
    const contrastRatio = findSymbol(ariaExtensions, 'aria-extensions-contrastRatio');

    it('is 1 for all black', () => {
      expect(ariaExtensions[contrastRatio](0, 0)).toEqual(1);
    });

    it('is 1 for all white', () => {
      expect(ariaExtensions[contrastRatio](1, 1)).toEqual(1);
    });

    it('is 1 for all 0.5', () => {
      expect(ariaExtensions[contrastRatio](0.5, 0.5)).toEqual(1);
    });

    it('is 21 for maximum contrast', () => {
      expect(ariaExtensions[contrastRatio](1, 0)).toEqual(21);
    });

    it('is correct for 1 / 0.5 luminosity', () => {
      expect(ariaExtensions[contrastRatio](1, 0.5).toFixed(4)).toEqual('1.9091');
    });

    it('is accepts luminosities in any order', () => {
      expect(ariaExtensions[contrastRatio](0, 1)).toEqual(21);
    });
  });

  describe('.[blend]', () => {
    const blend = findSymbol(ariaExtensions, 'aria-extensions-blend');

    it('returns solid foreground colours as is', () => {
      expect(ariaExtensions[blend]([30, 40, 50, 1], [60, 70, 80, 0.4]))
        .toEqual([30, 40, 50, 1]);
    });

    it('returns the background colour if the foreground is transparent', () => {
      expect(ariaExtensions[blend]([10, 10, 10, 0], [30, 40, 50, 0.4]))
        .toEqual([30, 40, 50, 0.4]);
    });

    it('it blends alpha with a solid colour', () => {
      expect(ariaExtensions[blend]([20, 20, 20, 0.2], [30, 40, 50, 1]))
        .toEqual([28, 36, 44, 1]);
    });

    it('it blends alpha with an alpha', () => {
      expect(ariaExtensions[blend]([20, 40, 60, 0.5], [80, 90, 100, 0.2]))
        .toEqual([30, 48 + (1 / 3), 66 + (2 / 3), 0.6]);
    });
  });

  describe('.[colourParts]', () => {
    const colourParts = findSymbol(ariaExtensions, 'aria-extensions-colourParts');

    it('parses "transparent"', () => {
      expect(ariaExtensions[colourParts]('transparent')).toEqual([0, 0, 0, 0]);
    });

    it('parses transparent rgba', () => {
      expect(ariaExtensions[colourParts]('rgba(0, 0, 0, 0)')).toEqual([0, 0, 0, 0]);
    });

    it('parses rgb', () => {
      expect(ariaExtensions[colourParts]('rgb(51, 102, 153)')).toEqual([51, 102, 153, 1]);
    });

    it('parses rgba with a whole alpha', () => {
      expect(ariaExtensions[colourParts]('rgba(51, 102, 153, 1)')).toEqual([51, 102, 153, 1]);
    });

    it('parses rgb without spaces', () => {
      expect(ariaExtensions[colourParts]('rgb(51,102,153)')).toEqual([51, 102, 153, 1]);
    });

    it('parses rgba with a decimal alpha', () => {
      expect(ariaExtensions[colourParts]('rgba(51, 102, 153, 0.3)')).toEqual([51, 102, 153, 0.3]);
    });

    it('parses hex', () => {
      expect(ariaExtensions[colourParts]('#1f2f3f')).toEqual([31, 47, 63, 1]);
    });

    it('parses shorthand hex', () => {
      expect(ariaExtensions[colourParts]('#123')).toEqual([17, 34, 51, 1]);
    });

    it('parses named colours', () => {
      expect(ariaExtensions[colourParts]('rebeccapurple')).toEqual([102, 51, 153, 1]);
    });
  });

  describe('.[backgroundColour]', () => {
    const backgroundColour = findSymbol(ariaExtensions, 'aria-extensions-backgroundColour');

    it('returns the background colour', () => {
      const el = appendToBody('<div style="background-color: #f00" />');
      expect(ariaExtensions[backgroundColour](el)).toEqual([255, 0, 0, 1]);
    });

    it('blends alpha with a parent background', () => {
      const el = appendToBody('<div style="background-color: #123"><div style="background-color: rgba(51, 102, 153, .5);" /></div>');
      expect(ariaExtensions[backgroundColour](el.firstChild)).toEqual([34, 68, 102, 1]);
    });

    it('blends with the document default colour', () => {
      const el = appendToBody('<div style="background-color: rgba(51, 102, 153, .5);" />');
      expect(ariaExtensions[backgroundColour](el)).toEqual([153, 179, 204, 1]);
    });

    it('blends opacity', () => {
      const el = appendToBody('<div style="background-color: #123; opacity: .5"><div style="background-color: rgba(51, 102, 153, .5); opacity: .5;" /></div>');
      expect(ariaExtensions[backgroundColour](el.firstChild)).toEqual([140, 153, 166, 1]);
    });
  });

  describe('.[textColour]', () => {
    const textColour = findSymbol(ariaExtensions, 'aria-extensions-textColour');

    it('returns the text colour', () => {
      const el = appendToBody('<div style="color: #f00" />');
      expect(ariaExtensions[textColour](el)).toEqual([255, 0, 0, 1]);
    });

    it('blends alpha with the background', () => {
      const el = appendToBody('<div style="color: rgba(51, 102, 153, .5); background-color: #123" />');
      expect(ariaExtensions[textColour](el)).toEqual([34, 68, 102, 1]);
    });

    it('blends alpha with a parent background', () => {
      const el = appendToBody('<div style="background-color: #123"><div style="color: rgba(51, 102, 153, .5);" /></div>');
      expect(ariaExtensions[textColour](el.firstChild)).toEqual([34, 68, 102, 1]);
    });

    it('blends with the document default colour', () => {
      const el = appendToBody('<div style="color: rgba(51, 102, 153, .5);" />');
      expect(ariaExtensions[textColour](el)).toEqual([153, 179, 204, 1]);
    });

    it('blends opacity', () => {
      const el = appendToBody('<div style="background-color: #123; opacity: .5;"><div style="color: rgba(51, 102, 153, .5); opacity: .5" /></div>');
      expect(ariaExtensions[textColour](el.firstChild)).toEqual([140, 153, 166, 1]);
    });
  });

  describe('#[contrast]', () => {
    it('returns 1 for same colour', () => {
      const el = appendToBody('<div style="color: #f00; background-color: #f00;"></div>');
      expect(el[symbols.contrast]).toEqual(1);
    });

    it('returns 21 for white text on a black background', () => {
      const el = appendToBody('<div style="color: #fff; background-color: #000;"></div>');
      expect(el[symbols.contrast]).toEqual(21);
    });

    it('returns 21 for black text on a white background', () => {
      const el = appendToBody('<div style="color: #000; background-color: #fff;"></div>');
      expect(el[symbols.contrast]).toEqual(21);
    });

    it('returns 9.04 for #000 on #aaa', () => {
      const el = appendToBody('<div style="color: #000; background-color: #aaa;"></div>');
      expect(el[symbols.contrast].toFixed(2)).toEqual('9.04');
    });

    it('returns 9.06 for #00000099 on #ccc (foreground with alpha)', () => {
      const el = appendToBody('<div style="color: rgba(0, 0, 0, .6); background-color: #ccc;"></div>');
      expect(el[symbols.contrast].toFixed(2)).toEqual('4.87');
    });

    it('returns the correct value for a background color applied to a parent', () => {
      const el = appendToBody('<div style="background-color: #aaa"><div style="color: #000"></div></div>');
      expect(el.firstChild[symbols.contrast].toFixed(2)).toEqual('9.04');
    });

    it('returns the correct value for a background color applied to a grand-parent', () => {
      const el = appendToBody('<div style="background-color: #aaa"><div><div style="color: #000"></div></div></div>');
      expect(el.firstChild.firstChild[symbols.contrast].toFixed(2)).toEqual('9.04');
    });

    it('returns the correct value for no background colour up to document', () => {
      const el = appendToBody('<div style="color: #aaa" />');
      expect(el[symbols.contrast].toFixed(2)).toEqual('2.32');
    });

    it('returns the correct value for alpha transparencies on background', () => {
      const el = appendToBody('<div style="color: rgba(255, 0, 0, .6);"><div style="color: #000" /></div>');
      expect(el[symbols.contrast].toFixed(2)).toEqual('2.86');
    });
  });

  describe('.contrast', () => {
    it('returns 1 for same luminosities', () => {
      expect(ariaExtensions.contrast('#aaa', '#aaa')).toEqual(1);
    });

    it('returns 21 for maximum contrast', () => {
      expect(ariaExtensions.contrast('#fff', '#000')).toEqual(21);
    });

    it('returns 9.04 or #aaa on #000 for something', () => {
      expect(ariaExtensions.contrast('#aaa', '#000').toFixed(2)).toEqual('9.04');
    });

    it('can handle named colours', () => {
      expect(ariaExtensions.contrast('red', 'green').toFixed(2)).toEqual('1.28');
    });

    it('it blends rgba', () => {
      expect(ariaExtensions.contrast('rgba(17, 85, 170, .6)', 'rgba(0, 0, 0, .2)').toFixed(2)).toEqual('2.39');
    });
  });
});
