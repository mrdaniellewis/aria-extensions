describe('name-extensions', () => {
  describe('#[accessibleName]', () => {
    it('returns an empty string for an empty element', () => {
      const node = appendToBody('<div />');
      expect(node[symbols.accessibleName]).toEqual('');
    });

    describe('labelledby', () => {
      it('returns the labelledby name', () => {
        const id = uniqueId();
        appendToBody(`<button id="${id}">foo</button>`);
        const node = appendToBody(`<div aria-labelledby="${id}" />`);
        expect(node[symbols.accessibleName]).toEqual('foo');
      });

      it('returns multiple labelledby names separated by spaces in id-list order', () => {
        const id = uniqueId();
        const id2 = uniqueId();
        appendToBody(`<button id="${id}">foo</button>`);
        appendToBody(`<button id="${id2}">bar</button>`);
        const node = appendToBody(`<div aria-labelledby="${id2} ${id}" />`);
        expect(node[symbols.accessibleName]).toEqual('bar foo');
      });

      it('returns names of hidden elements', () => {
        const id = uniqueId();
        appendToBody(`<button aria-hidden="true" id="${id}">foo</button>`);
        const node = appendToBody(`<div aria-labelledby="${id}" />`);
        expect(node[symbols.accessibleName]).toEqual('foo');
      });

      it('does not recursively resolve labelledby attributes', () => {
        const id = uniqueId();
        const id2 = uniqueId();
        appendToBody(`<button id="${id}" aria-labelledby="${id2}">foo</button>`);
        appendToBody(`<button id="${id2}">bar</button>`);
        const node = appendToBody(`<div aria-labelledby="${id}" />`);
        expect(node[symbols.accessibleName]).toEqual('foo');
      });
    });

    describe('aria-label', () => {
      it('returns a non-empty aria-label', () => {
        const node = appendToBody('<div aria-label="foo" />');
        expect(node[symbols.accessibleName]).toEqual('foo');
      });

      it('returns aria-labelledby in preference to aria-label', () => {
        const id = uniqueId();
        const node = appendToBody(`
          <div aria-label="bar" aria-labelledby="${id}" />
          <div id="${id}">foo</div>
        `);
        expect(node[symbols.accessibleName]).toEqual('foo');
      });

      it('returns aria-label if aria-laballedby is empty', () => {
        const node = appendToBody('<div aria-label="foo" aria-labelledby="" />');
        expect(node[symbols.accessibleName]).toEqual('foo');
      });
    });

    describe('native text alternative', () => {
      it('ignores the native text alternative if role="none"', () => {
        const node = appendToBody('<img alt="alt" role="none" />');
        expect(node[symbols.accessibleName]).toEqual('');
      });

      it('ignores the native text alternative if role="presentation"', () => {
        const node = appendToBody('<img alt="alt" role="presentation" />');
        expect(node[symbols.accessibleName]).toEqual('');
      });

      context('native label returns text', () => {
        it('returns the native label of an element', () => {
          const node = appendToBody('<img alt="alt" />');
          expect(node[symbols.accessibleName]).toEqual('alt');
        });
      });

      context('native label returns element', () => {
        it('returns the names of an elements', () => {
          const node = appendToBody('<fieldset><legend>foo</legend></fieldset>');
          expect(node[symbols.accessibleName]).toEqual('foo');
        });

        it('does include hidden elements', () => {
          const node = appendToBody('<fieldset><legend aria-hidden="true">foo</legend></fieldset>');
          expect(node[symbols.accessibleName]).toEqual('');
        });
      });

      context('native label returns elements', () => {
        it('returns the names of an elements', () => {
          const id = uniqueId();
          const node = appendToBody(`
            <input id="${id}" />
            <label for="${id}">foo</label>
            <label for="${id}">bar</label>
          `);

          expect(node[symbols.accessibleName]).toEqual('foo bar');
        });

        it('does include hidden elements', () => {
          const id = uniqueId();
          const node = appendToBody(`
            <input id="${id}" />
            <label for="${id}" aria-hidden="true">foo</label>
            <label for="${id}">bar</label>
          `);

          expect(node[symbols.accessibleName]).toEqual('bar');
        });

        it('does not create infinite loops', () => {
          const id = uniqueId();
          const node = appendToBody(`<label for="${id}">foo <input id="${id}" /><label>`).querySelector('input');

          expect(node[symbols.accessibleName]).toEqual('foo');
        });
      });

      context('precedence', () => {
        it('returns aria-label in preference to native text alternative', () => {
          const node = appendToBody('<img alt="alt" aria-label="foo" />');
          expect(node[symbols.accessibleName]).toEqual('foo');
        });

        it('returns the native text alternative if aria-label is empty', () => {
          const node = appendToBody('<img alt="alt" aria-label="" />');
          expect(node[symbols.accessibleName]).toEqual('alt');
        });
      });

      describe('elements', () => {
        describe('<area>', () => {
          it('uses alt as the text alternative', () => {
            const node = appendToBody('<map name="map"><area alt="foo" /></map><img usemap="#map" />').querySelector('area');
            expect(node[symbols.accessibleName]).toEqual('foo');
          });
        });

        describe('<img>', () => {
          it('uses alt as the text alternative', () => {
            const node = appendToBody('<img alt="foo" />');
            expect(node[symbols.accessibleName]).toEqual('foo');
          });
        });

        ['button', 'input', 'meter', 'output', 'progress', 'select', 'textarea'].forEach((name) => {
          describe(`<${name}>`, () => {
            it('uses labels as the text alternative', () => {
              const id = uniqueId();
              const node = appendToBody(`<label>foo<${name} id="${id}"></${name}></label><label for="${id}">fee</label>`).querySelector(name);
              expect(node[symbols.accessibleName]).toEqual('foo fee');
            });

            it('does not use a hidden label', () => {
              const id = uniqueId();
              const node = appendToBody(`<${name} id="${id}"></${name}><label hidden for="${id}">foo</label>`);
              expect(node[symbols.accessibleName]).toEqual('');
            });
          });
        });

        [['details', 'summary'], ['fieldset', 'legend']].forEach(([parent, child]) => {
          describe(`<${parent}>`, () => {
            it('uses the first child summary as the text alternative', () => {
              const node = appendToBody(`<${parent}><${child}>foo</${child}><${child}>bar</${child}></${parent}>`);
              expect(node[symbols.accessibleName]).toEqual('foo');
            });

            it('does not use a nested summary', () => {
              const node = appendToBody(`<${parent}><div><${child}>foo</${child}></div></${parent}>`);
              expect(node[symbols.accessibleName]).toEqual('');
            });

            it('does not use a hidden summary', () => {
              const node = appendToBody(`<${parent}><${child} hidden>foo</${child}><${child}>bar</${child}></${parent}>`);
              expect(node[symbols.accessibleName]).toEqual('');
            });
          });
        });

        describe('<table>', () => {
          it('returns an empty string with no caption', () => {
            const node = appendToBody('<table></table>');
            expect(node[symbols.accessibleName]).toEqual('');
          });

          it('uses the caption', () => {
            const node = appendToBody('<table><caption>foo</caption></table>');
            expect(node[symbols.accessibleName]).toEqual('foo');
          });

          it('does not use a hidden caption', () => {
            const node = appendToBody('<table><caption hidden>foo</caption></table>');
            expect(node[symbols.accessibleName]).toEqual('');
          });
        });
      });
    });

    describe('name from contents', () => {
      it('returns contents from text nodes for elements allowing name from contents', () => {
        const node = appendToBody('<div role="button">bar</div>');
        expect(node[symbols.accessibleName]).toEqual('bar');
      });

      it('does not return contents from text nodes for roles not allowing name from contents', () => {
        const node = appendToBody('<div>bar</div>');
        expect(node[symbols.accessibleName]).toEqual('');
      });

      it('recursively finds the name of child elements', () => {
        const node = appendToBody('<div role="button"><div><span>foo</span><span>bar</span></div>');
        expect(node[symbols.accessibleName]).toEqual('foobar');
      });

      it('trims additional whitespace', () => {
        const node = appendToBody('<div role="button"> <div>  <span>foo</span><span>bar</span>  <span>fee</span> </div>');
        expect(node[symbols.accessibleName]).toEqual('foobar fee');
      });

      it('uses the full algorithm on descendant nodes', () => {
        const node = appendToBody('<div role="button"><div><span aria-label="fee">foo</span></div>');
        expect(node[symbols.accessibleName]).toEqual('fee');
      });

      it('does not create infinite loops', () => {
        const id = uniqueId();
        const node = appendToBody(`<div role="button"><div id="${id}">foo<span aria-labelledby="${id}">bar</span></div></div>`);
        expect(node[symbols.accessibleName]).toEqual('foo');
      });

      it('does not recurse hidden elements', () => {
        const node = appendToBody('<div role="button"><div aria-hidden="true">foo</div></div>');
        expect(node[symbols.accessibleName]).toEqual('');
      });

      it('does not recurse hidden elements when resolving visible aria-labelledby', () => {
        const id = uniqueId();
        const node = appendToBody(`
          <button aria-labelledby="${id}">foo</button>
          <div id="${id}"><span style="display: none">bar</span></div>
        `);
        expect(node[symbols.accessibleName]).toEqual('');
      });

      it('recurses hidden elements when following a labelledby hidden labelledby element', () => {
        const id = uniqueId();
        const node = appendToBody(`
          <button aria-labelledby="${id}">foo</button>
          <div id="${id}" aria-hidden="true"><span style="display: none">bar</span></div>
        `);
        expect(node[symbols.accessibleName]).toEqual('bar');
      });

      it('returns native text alternative in preference to DOM contents for text-alternatives', () => {
        const id = uniqueId();
        const node = appendToBody(`<button id="${id}">bar</button><label for="${id}">foo</label>`);
        expect(node[symbols.accessibleName]).toEqual('foo');
      });

      it('returns the DOM contents in preference to native text alternative if no text content is found', () => {
        const id = uniqueId();
        const node = appendToBody(`<button id="${id}">bar</button><label for="${id}" />`);
        expect(node[symbols.accessibleName]).toEqual('bar');
      });

      describe('embedded controls', () => {
        context('when getting a name for a widget', () => {
          it('uses the value of an <input>', () => {
            const node = appendToBody('<div role="button"><input value="foo" /></div>');
            expect(node[symbols.accessibleName]).toEqual('foo');
          });

          it('uses the value of a <select>', () => {
            const node = appendToBody('<div role="button"><select><option>one</option><option selected>two</option></select></div>');
            expect(node[symbols.accessibleName]).toEqual('two');
          });

          it('uses the value of a <select multiple>', () => {
            const node = appendToBody(`<div role="button">
              <select multiple>
                <option>one</option>
                <option selected>two</option>
                <option selected>three</option>
              </select>
            </div>`);
            expect(node[symbols.accessibleName]).toEqual('two three');
          });

          it('uses the value of a <textarea>', () => {
            const node = appendToBody('<div role="button"><textarea aria-label="bar">foo</textarea></div>');
            expect(node[symbols.accessibleName]).toEqual('foo');
          });

          it('uses the value of a widget of type textbox', () => {
            const node = appendToBody('<div role="button"><span role="textbox" aria-label="bar">foo<span></div>');
            expect(node[symbols.accessibleName]).toEqual('foo');
          });

          it('uses the value of a widget of type searchbox', () => {
            const node = appendToBody('<div role="button"><span role="searchbox" aria-label="bar">foo<span></div>');
            expect(node[symbols.accessibleName]).toEqual('foo');
          });

          it('uses the value of a widget of type range using aria-valuenow', () => {
            const node = appendToBody('<button><div role="slider" aria-valuemin="0" aria-valuenow="102" aria-valuemax="255"></div></button>');
            expect(node[symbols.accessibleName]).toEqual('102');
          });

          it('uses the value of a widget of type range using aria-valuetext', () => {
            const node = appendToBody('<button><div role="slider" aria-valuemin="1" aria-valuenow="5" aria-valuetext="May" aria-valuemax="12"></div></button>');
            expect(node[symbols.accessibleName]).toEqual('May');
          });

          it('uses the widget value in preference to aria-label', () => {
            const node = appendToBody('<div role="button"><input value="foo" aria-label="bar" /></div>');
            expect(node[symbols.accessibleName]).toEqual('foo');
          });

          it('uses the widget value in preference to native label', () => {
            const id = uniqueId();
            const node = appendToBody(`
              <div role="button"><input value="foo" id="${id}" /></div>
              <label for="${id}">bar</label>
            `);
            expect(node[symbols.accessibleName]).toEqual('foo');
          });

          it('uses aria-labelledby in preference to the widget value', () => {
            const id = uniqueId();
            const node = appendToBody(`
              <div role="button"><input value="foo" aria-labelledby="${id}" /></div>
              <span id="${id}">bar</span>
            `);
            expect(node[symbols.accessibleName]).toEqual('bar');
          });
        });

        context('when getting a name for not a widget', () => {
          it('uses the accessible name of the <input>', () => {
            const node = appendToBody('<div role="heading"><input value="foo" aria-label="bar" /></div>');
            expect(node[symbols.accessibleName]).toEqual('bar');
          });
        });
      });
    });

    describe('tooltip', () => {
      it('returns the tooltip', () => {
        const node = appendToBody('<div title="foo"></div>');
        expect(node[symbols.accessibleName]).toEqual('foo');
      });

      context('roles allowing name from contents', () => {
        it('returns DOM contents in preference to a tooltip', () => {
          const node = appendToBody('<div role="button" title="foo">bar</div>');
          expect(node[symbols.accessibleName]).toEqual('bar');
        });

        it('returns the tooltip if the DOM contents are empty', () => {
          const node = appendToBody('<div role="button" title="foo"></div>');
          expect(node[symbols.accessibleName]).toEqual('foo');
        });
      });

      context('roles not allowing name from contents', () => {
        it('returns the tooltip if the element has DOM contents', () => {
          const node = appendToBody('<div title="foo">bar</div>');
          expect(node[symbols.accessibleName]).toEqual('foo');
        });

        it('returns the native text alternative in preference to tooltip', () => {
          const node = appendToBody('<table title="bar"><caption>bar</caption></table>');
          expect(node[symbols.accessibleName]).toEqual('bar');
        });
      });
    });

    describe('flat string', () => {
      it('returns the name as a trimmed flat string', () => {
        const node = appendToBody(`<button>
          <div>
            foo
            <img alt="bar\nfi  \t\rthumb" />
            <span>fee </span>  <span>foo</span><span>fox</span>
            <div aria-label=" foo " />
            <input value=" frog "/>
          </div>
        </button>`);
        expect(node[symbols.accessibleName]).toEqual('foo bar fi thumb fee foofox foo frog');
      });
    });

    describe('specification examples', () => {
      it('passes nested labelledby traversal example', () => {
        const id1 = uniqueId();
        const id2 = uniqueId();
        const id3 = uniqueId();
        const el1 = appendToBody(`<element1 id="${id1}" aria-labelledby="${id3}" />`);
        const el2 = appendToBody(`<element2 id="${id2}" aria-labelledby="${id1}" />`);
        appendToBody(`<element3 id="${id3}">hello</element3>`);
        expect(el1[symbols.accessibleName]).toEqual('hello');
        expect(el2[symbols.accessibleName]).toEqual('');
      });

      it('passes aria-labelledby referring to itself example', () => {
        const id1 = uniqueId();
        const id2 = uniqueId();
        const node = appendToBody(`
          <span role="button" id="${id1}" aria-label="Delete" aria-labelledby="${id1} ${id2}"></span>
          <a id="${id2}" href="./files/Documentation.pdf">Documentation.pdf</a>
        `);
        expect(node[symbols.accessibleName]).toEqual('Delete Documentation.pdf');
      });

      it('passes the embedded control example', () => {
        const node = appendToBody('<div role="checkbox" aria-checked="false">Flash the screen <span role="textbox" aria-multiline="false"> 5 </span> times</div>');
        expect(node[symbols.accessibleName]).toEqual('Flash the screen 5 times');
      });
    });

    describe('common techniques', () => {
      it('uses screen reader hidden text as a text alternative', () => {
        const id = uniqueId();
        const node = appendToBody(`
          <input id="${id}" />
          <label for="${id}" class="sr-only">foo</label>
          <style>
            .sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              overflow: hidden;
              clip: rect(0,0,0,0);
              white-space: nowrap;
              clip-path: inset(50%);
              border: 0;
            }
          </style>
        `);
        expect(node[symbols.accessibleName]).toEqual('foo');
      });
    });

    describe('caching', () => {
      it('caches', () => {
        ariaExtensions.startCaching();
        const node = appendToBody('<img alt="foo" />');
        expect(node[symbols.accessibleName]).toEqual('foo');
        node.alt = 'bar';
        expect(node[symbols.accessibleName]).toEqual('foo');
      });
    });
  });

  describe('#[accessibleDescription]', () => {
    context('aria-describedby', () => {
      it('returns an empty string for elements by no ariadescribedby attribute', () => {
        const node = appendToBody('<button>foo</button>');
        expect(node[symbols.accessibleDescription]).toEqual('');
      });

      it('returns an empty string for hidden elements', () => {
        const id = uniqueId();
        const node = appendToBody(`
          <div aria-hidden="true" aria-describedby="${id}" />')
          <div id="${id}">foo</div>
        `);
        expect(node[symbols.accessibleDescription]).toEqual('');
      });

      it('returns the name of the referenced aria-describedby elements in attribute order', () => {
        const id1 = uniqueId();
        const id2 = uniqueId();
        const node = appendToBody(`
          <div aria-describedby="${id1} ${id2}" />')
          <div id="${id2}">bar</div>
          <div id="${id1}">foo</div>
        `);
        expect(node[symbols.accessibleDescription]).toEqual('foo bar');
      });
    });

    // TODO: add elements that have a native description

    context('recursion', () => {
      it('does not return name using aria-labelledby', () => {
        const id = uniqueId();
        const node = appendToBody(`
          <div aria-labelledby="${id}" />')
          <div id="${id}">foo</div>
        `);
        expect(node[symbols.accessibleDescription]).toEqual('');
      });

      it('returns the described from referenced elements that are hidden', () => {
        const id = uniqueId();
        const node = appendToBody(`
          <div aria-describedby="${id}" />')
          <div id="${id}" aria-hidden="true">foo</div>
        `);
        expect(node[symbols.accessibleDescription]).toEqual('foo');
      });

      it('does not follow multiple aria-describedby attributes', () => {
        const id1 = uniqueId();
        const id2 = uniqueId();
        const node = appendToBody(`
          <div aria-describedby="${id1}" />')
          <div id="${id1}" aria-describedby="${id2}">foo</div>
          <div id="${id2}">bar</div>
        `);
        expect(node[symbols.accessibleDescription]).toEqual('foo');
      });

      it('follows aria-labelledby attributes on referenced elements', () => {
        const id1 = uniqueId();
        const id2 = uniqueId();
        const node = appendToBody(`
          <div aria-describedby="${id1}" />')
          <div id="${id1}" aria-labelledby="${id2}">foo</div>
          <div id="${id2}">bar</div>
        `);
        expect(node[symbols.accessibleDescription]).toEqual('bar');
      });

      it('does not return the native description when recursing', () => {
        const id = uniqueId();
        const node = appendToBody(`
          <div aria-describedby="${id}" />')
          <native-text id="${id}" data-description="foo">bar</native-text>
        `);
        expect(node[symbols.accessibleDescription]).toEqual('bar');
      });
    });

    describe('flat string', () => {
      it('returns the description as a trimmed flat string', () => {
        const id = uniqueId();
        const node = appendToBody(`
          <button aria-describedby="${id}">button</button>
          <div id="${id}">
            foo
            <!-- TODO: add native description "bar\nfi  \t\rthumb" -->
            <span>fee </span>  <span>foo</span><span>fox</span>
            <div aria-label=" foo " />
            <input value=" frog "/>
          </div>
        </button>`);
        expect(node[symbols.accessibleDescription]).toEqual('foo fee foofox foo frog');
      });
    });

    describe('caching', () => {
      it('caches', () => {
        ariaExtensions.startCaching();
        const id = uniqueId();
        const node = appendToBody(`<div aria-describedby="${id}" /><div id="${id}">foo</div>`);
        expect(node[symbols.accessibleDescription]).toEqual('foo');
        node.removeAttribute('aria-describedby');
        expect(node[symbols.accessibleDescription]).toEqual('foo');
      });
    });
  });
});
