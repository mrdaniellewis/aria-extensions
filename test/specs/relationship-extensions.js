describe('relationship extensions', () => {
  ['details', 'errormessage', 'activedescendant'].forEach((name) => {
    describe(`#[${name}]`, () => {
      it(`returns null if there is no aria-${name} attribute`, () => {
        const node = appendToBody('<div />');
        expect(node[symbols[name]]).toEqual(null);
      });

      it(`returns null if there is an empty aria-${name} attribute`, () => {
        const node = appendToBody(`<div aria-${name} />`);
        expect(node[symbols[name]]).toEqual(null);
      });

      it(`returns null if there is a whitespace aria-${name} attribute`, () => {
        const node = appendToBody(`<div aria-${name}=" " />`);
        expect(node[symbols[name]]).toEqual(null);
      });

      it(`returns null if aria-${name} has no valid target`, () => {
        const node = appendToBody(`<div aria-${name}="${uniqueId()}" />`);
        expect(node[symbols[name]]).toEqual(null);
      });

      it(`returns and element if aria-${name} has a valid target`, () => {
        const id = uniqueId();
        const target = appendToBody(`<div id="${id}" />`);
        const node = appendToBody(`<div aria-${name}="${id}" />`);
        expect(node[symbols[name]]).toEqual(target);
      });

      describe('caching', () => {
        it('can cache the value', () => {
          ariaExtensions.startCaching();
          const id = uniqueId();
          const target = appendToBody(`<div id="${id}" />`);
          const node = appendToBody(`<div aria-${name}="${id}" />`);
          expect(node[symbols[name]]).toEqual(target);
          target.remove();
        });
      });
    });
  });

  ['controls', 'describedby', 'flowto', 'labelledby', 'owns'].forEach((name) => {
    describe(`#[${name}]`, () => {
      it(`returns an empty array if there is no aria-${name} attribute`, () => {
        const node = appendToBody('<div />');
        expect(node[symbols[name]]).toEqual([]);
      });

      it(`returns an empty array if there is an empty aria-${name} attribute`, () => {
        const node = appendToBody(`<div aria-${name} />`);
        expect(node[symbols[name]]).toEqual([]);
      });

      it(`returns an empty array if there is a whitespace aria-${name} attribute`, () => {
        const node = appendToBody(`<div aria-${name}=" " />`);
        expect(node[symbols[name]]).toEqual([]);
      });

      it(`returns any empty array if aria-${name} has no valid target`, () => {
        const node = appendToBody(`<div aria-${name}="${uniqueId()}" />`);
        expect(node[symbols[name]]).toEqual([]);
      });

      it(`returns elements if aria-${name} has a valid targets`, () => {
        const id1 = uniqueId();
        const id2 = uniqueId();
        const target1 = appendToBody(`<div id="${id1}" />`);
        const target2 = appendToBody(`<div id="${id2}" />`);
        const node = appendToBody(`<div aria-${name}="${id2} ${id1}" />`);
        expect(node[symbols[name]]).toEqual([target2, target1]);
      });

      describe('caching', () => {
        it('can cache the value', () => {
          ariaExtensions.startCaching();
          const id = uniqueId();
          const target = appendToBody(`<div id="${id}" />`);
          const node = appendToBody(`<div aria-${name}="${id}" />`);
          expect(node[symbols[name]]).toEqual([target]);
          target.remove();
        });
      });
    });
  });
});
