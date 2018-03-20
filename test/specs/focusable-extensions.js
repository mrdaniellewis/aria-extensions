describe('focusable extensions', () => {
  describe('#[focusable]', () => {
    it('returns false for a non-focusable element', () => {
      const node = appendToBody('<div />');
      expect(node[symbols.focusable]).toEqual(false);
    });

    context('tabindex attribute', () => {
      it('returns true for a valid tabindex attribute', () => {
        const node = appendToBody('<div tabindex="-1" />');
        expect(node[symbols.focusable]).toEqual(true);
      });

      it('returns false for an invalid tabindex attribute', () => {
        const node = appendToBody('<div tabindex="foo" />');
        expect(node[symbols.focusable]).toEqual(false);
      });
    });

    context('draggable attribute', () => {
      it('returns true for a draggable attribute of "true"', () => {
        const node = appendToBody('<div draggable="true" />');
        expect(node[symbols.focusable]).toEqual(true);
      });

      it('returns false for a draggable attribute of "false"', () => {
        const node = appendToBody('<div draggable="false" />');
        expect(node[symbols.focusable]).toEqual(false);
      });
    });

    context('focusable elements', () => {
      context('<a>', () => {
        it('returns true with a href', () => {
          const node = appendToBody('<a href="#">foo</a>');
          expect(node[symbols.focusable]).toEqual(true);
        });

        it('returns false without a href', () => {
          const node = appendToBody('<a>foo</a>');
          expect(node[symbols.focusable]).toEqual(false);
        });

        it('returns false if hidden', () => {
          const node = appendToBody('<a href="#" hidden>foo</a>');
          expect(node[symbols.focusable]).toEqual(false);
        });
      });

      context('<button>', () => {
        it('returns true', () => {
          const node = appendToBody('<button>foo</button>');
          expect(node[symbols.focusable]).toEqual(true);
        });

        it('returns false if disabled', () => {
          const node = appendToBody('<button disabled>foo</button>');
          expect(node[symbols.focusable]).toEqual(false);
        });

        it('returns false if disabled by a fieldset', () => {
          const node = appendToBody('<fieldset disabled><button>foo</button></fieldset>').querySelector('button');
          expect(node[symbols.focusable]).toEqual(false);
        });

        it('returns false if hidden', () => {
          const node = appendToBody('<button hidden>foo</button>');
          expect(node[symbols.focusable]).toEqual(false);
        });
      });

      context('<input>', () => {
        it('returns true', () => {
          const node = appendToBody('<input />');
          expect(node[symbols.focusable]).toEqual(true);
        });

        it('returns false for a type of hidden', () => {
          const node = appendToBody('<input type="hidden" />');
          expect(node[symbols.focusable]).toEqual(false);
        });

        it('returns false if disabled', () => {
          const node = appendToBody('<input disabled />');
          expect(node[symbols.focusable]).toEqual(false);
        });

        it('returns false if disabled by a fieldset', () => {
          const node = appendToBody('<fieldset disabled><input /></fieldset>').querySelector('input');
          expect(node[symbols.focusable]).toEqual(false);
        });

        it('returns false if hidden', () => {
          const node = appendToBody('<input hidden />');
          expect(node[symbols.focusable]).toEqual(false);
        });
      });

      context('<select>', () => {
        it('returns true', () => {
          const node = appendToBody('<select />');
          expect(node[symbols.focusable]).toEqual(true);
        });

        it('returns false if disabled', () => {
          const node = appendToBody('<select disabled />');
          expect(node[symbols.focusable]).toEqual(false);
        });

        it('returns false if disabled by a fieldset', () => {
          const node = appendToBody('<fieldset disabled><select /></fieldset>').querySelector('select');
          expect(node[symbols.focusable]).toEqual(false);
        });

        it('returns false if hidden', () => {
          const node = appendToBody('<select hidden />');
          expect(node[symbols.focusable]).toEqual(false);
        });
      });

      context('<textarea>', () => {
        it('returns true', () => {
          const node = appendToBody('<textarea></textarea>');
          expect(node[symbols.focusable]).toEqual(true);
        });

        it('returns false if disabled', () => {
          const node = appendToBody('<textarea disabled></textarea>');
          expect(node[symbols.focusable]).toEqual(false);
        });

        it('returns false if disabled by a fieldset', () => {
          const node = appendToBody('<fieldset disabled><textarea></textarea></fieldset>').querySelector('textarea');
          expect(node[symbols.focusable]).toEqual(false);
        });

        it('returns false if hidden', () => {
          const node = appendToBody('<textarea hidden></textarea>');
          expect(node[symbols.focusable]).toEqual(false);
        });
      });

      context('<audio>', () => {
        it('returns true with a controls attribute', () => {
          const node = appendToBody('<audio controls></audio>');
          expect(node[symbols.focusable]).toEqual(true);
        });

        it('returns false without a controls attribute', () => {
          const node = appendToBody('<audio></audio>');
          expect(node[symbols.focusable]).toEqual(false);
        });

        it('returns false if hidden', () => {
          const node = appendToBody('<audio controls hidden></audio>');
          expect(node[symbols.focusable]).toEqual(false);
        });
      });

      context('<video>', () => {
        it('returns true with a controls attribute', () => {
          const node = appendToBody('<video controls></video>');
          expect(node[symbols.focusable]).toEqual(true);
        });

        it('returns false without a controls attribute', () => {
          const node = appendToBody('<video></video>');
          expect(node[symbols.focusable]).toEqual(false);
        });

        it('returns false if hidden', () => {
          const node = appendToBody('<video controls hidden></video>');
          expect(node[symbols.focusable]).toEqual(false);
        });
      });
    });

    context('contenteditable elements', () => {
      it('returns true if editable', () => {
        const node = appendToBody('<div contenteditable="true" />');
        expect(node[symbols.focusable]).toEqual(true);
      });

      it('returns false if contenteditable is false', () => {
        const node = appendToBody('<div contenteditable="false" />');
        expect(node[symbols.focusable]).toEqual(false);
      });

      it('returns false if already within a contenteditable section', () => {
        const node = appendToBody('<div contenteditable="true"><span contenteditable="true" /></div>').querySelector('span');
        expect(node[symbols.focusable]).toEqual(false);
      });

      it('returns true if within nested contenteditable section', () => {
        const node = appendToBody('<div contenteditable="true"><div contenteditable="false"><span contenteditable="true" /></div></div>').querySelector('span');
        expect(node[symbols.focusable]).toEqual(true);
      });
    });

    context('caching', () => {
      it('caches', () => {
        ariaExtensions.startCaching();
        const node = appendToBody('<div tabindex="-1" />');
        expect(node[symbols.focusable]).toEqual(true);
        node.removeAttribute('tabindex');
        expect(node[symbols.focusable]).toEqual(true);
      });
    });
  });

  describe('#findFocusable', () => {
    it('finds all focusable elements', () => {
      const id = uniqueId();
      const node = appendToBody(`<div>
        <textarea></textarea>
        <div tabindex="-1" />
        <div draggable="true" />
        <div contenteditable="true" />
        <div draggable="false" />
        <div contenteditable="false" />
        <map name="${id}"><area /></map>
        <img usemap="#${id}" />
      <div>`);

      expect(node[symbols.findFocusable]()).toEqual([
        node.querySelector('textarea'),
        node.querySelector('div[tabindex]'),
        node.querySelector('div[draggable]'),
        node.querySelector('div[contenteditable]'),
        node.querySelector('area'),
      ]);
    });

    it('finds itself if focusable', () => {
      const node = appendToBody('<div tabindex="0" />');
      expect(node[symbols.findFocusable]()).toEqual([node]);
    });

    it('can also be called on document', () => {
      const node = appendToBody('<div tabindex="0" />');
      expect(document[symbols.findFocusable]()).toContain(node);
    });
  });
});
