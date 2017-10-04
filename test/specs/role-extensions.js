describe('role-extensions', () => {
  describe('.expandWithChildRoles', () => {
    it('expands roletype to include all roles', () => {
      expect(ariaExtensions.expandWithChildRoles('roletype'))
        .toEqual(Object.keys(ariaExtensions.roles));
    });

    it('expands an array of role names', () => {
      expect(ariaExtensions.expandWithChildRoles(['alert', 'dialog', 'cell']))
        .toEqual(['alert', 'alertdialog', 'cell', 'columnheader', 'dialog', 'gridcell', 'rowheader']);
    });
  });

  describe('.roleAttributes', () => {
    it('returns the attributes for a role', () => {
      expect(ariaExtensions.roleAttributes('rowheader'))
        .toEqual(['atomic', 'busy', 'colindex', 'colspan', 'controls', 'current', 'describedby', 'details', 'disabled', 'dropeffect', 'errormessage', 'expanded', 'flowto', 'grabbed', 'haspopup', 'hidden', 'invalid', 'keyshortcuts', 'label', 'labelledby', 'live', 'owns', 'readonly', 'relevant', 'required', 'roledescription', 'rowindex', 'rowspan', 'selected', 'sort']);
    });
  });

  describe('.roleMatches', () => {
    context('matching a string role against a string role', () => {
      it('returns false if a role does not match', () => {
        expect(ariaExtensions.roleMatches('cell', 'dialog')).toEqual(false);
      });

      it('returns true for matching any role to roletype', () => {
        Object.keys(ariaExtensions.roles).forEach((name) => {
          expect(ariaExtensions.roleMatches(name, 'roletype')).toEqual(true, `expected ${name} to match roletype`);
        });
      });

      it('returns false for matching roletype to any role', () => {
        Object.keys(ariaExtensions.roles)
          .filter(name => name !== 'roletype')
          .forEach((name) => {
            expect(ariaExtensions.roleMatches('roletype', name)).toEqual(false, `expected roletype to not match ${name}`);
          });
      });
    });

    context('matching a string role against an array of roles', () => {
      it('returns true if a role matches', () => {
        expect(ariaExtensions.roleMatches('alertdialog', ['cell', 'dialog'])).toEqual(true);
      });
    });

    context('matching an array of roles against a string role', () => {
      it('returns true if a role matches', () => {
        expect(ariaExtensions.roleMatches(['navigation', 'alertdialog'], 'dialog')).toEqual(true);
      });
    });

    context('matching an array of roles against an array of roles', () => {
      it('returns true if a role matches', () => {
        expect(ariaExtensions.roleMatches(['navigation', 'alertdialog'], ['cell', 'dialog'])).toEqual(true);
      });
    });

    context('exact is true', () => {
      it('returns true if matching roletype to roletype', () => {
        expect(ariaExtensions.roleMatches('roletype', 'roletype', { exact: true })).toEqual(true);
      });

      it('returns false if matching any other role to roletype', () => {
        Object.keys(ariaExtensions.roles)
          .filter(name => name !== 'roletype')
          .forEach((name) => {
            expect(ariaExtensions.roleMatches(name, 'roletype', { exact: true })).toEqual(false, `expected ${name} not to match roletype`);
          });
      });
    });
  });

  describe('#[role]', () => {
    context('without a role attribute', () => {
      it('returns null for an unknown element', () => {
        const el = appendToBody('<foo />');
        expect(el[symbols.role]).toEqual(null);
      });

      it('returns null for an element with no implicit role', () => {
        const el = appendToBody('<audio />');
        expect(el[symbols.role]).toEqual(null);
      });

      it('returns the implicit role for an element with an implicit role', () => {
        const el = appendToBody('<a href="#" />');
        expect(el[symbols.role]).toEqual('link');
      });
    });

    context('with a role attribute', () => {
      it('returns null for an element with an empty role attribute', () => {
        const el = appendToBody('<div role />');
        expect(el[symbols.role]).toEqual(null);
      });

      it('returns null for an element with an unknown role', () => {
        const el = appendToBody('<div role="foo" />');
        expect(el[symbols.role]).toEqual(null);
      });

      it('returns the implicit role for an element with an empty role attribute', () => {
        const el = appendToBody('<a href="#" role />');
        expect(el[symbols.role]).toEqual('link');
      });

      it('returns the first none abstract role on the role attribute', () => {
        const el = appendToBody('<a href="#" role="unknown structure dialog" />');
        expect(el[symbols.role]).toEqual('dialog');
      });

      it('ignores none when combined with global aria attributes', () => {
        const el = appendToBody('<article role="none" aria-haspopup="true" />');
        expect(el[symbols.role]).toEqual('article');
      });

      it('ignores presentation when combined with global aria attributes', () => {
        const el = appendToBody('<article role="presentation" aria-haspopup="true" />');
        expect(el[symbols.role]).toEqual('article');
      });

      it('does not ignore none when combined with role aria attributes', () => {
        const el = appendToBody('<article role="none" aria-posinset="4" />');
        expect(el[symbols.role]).toEqual('none');
      });
    });

    context('caching', () => {
      it('caches the value', () => {
        ariaExtensions.startCaching();
        const el = appendToBody('<a href="#" />');
        expect(el[symbols.role]).toEqual('link');
        el.removeAttribute('href');
        expect(el[symbols.role]).toEqual('link');
      });
    });
  });

  describe('#[closestRole]', () => {
    it('returns null if the role is invalid', () => {
      const el = appendToBody('<div />');
      expect(el[symbols.closestRole]('foo')).toEqual(null);
    });

    it('returns null if no role is found', () => {
      const el = appendToBody('<div />');
      expect(el[symbols.closestRole]('link')).toEqual(null);
    });

    it('returns itself if the role is on the element', () => {
      const el = appendToBody('<a href="#" />');
      expect(el[symbols.closestRole]('link')).toEqual(el);
    });

    it('returns the closest ancestor with the role', () => {
      const el = appendToBody('<a href="#" />');
      expect(el[symbols.closestRole]('document')).toEqual(document.body);
    });

    it('returns the closest ancestor with a matching subrole', () => {
      const el = appendToBody('<a href="#" />');
      expect(el[symbols.closestRole]('structure')).toEqual(document.body);
    });

    context('array options', () => {
      it('returns the closest ancestor matching an array of roles', () => {
        const el = appendToBody('<div />');
        expect(el[symbols.closestRole](['link', 'structure'])).toEqual(document.body);
      });
    });

    context('exact', () => {
      it('returns the closest ancestor exactly matching a role', () => {
        const el = appendToBody('<div role="alert"><div role="alertdialog" /></div>');
        expect(el.firstChild[symbols.closestRole]('alert', { exact: true })).toEqual(el);
      });
    });

    context('caching', () => {
      it('caches the value', () => {
        ariaExtensions.startCaching();
        const el = appendToBody('<a href="#" />');
        expect(el[symbols.closestRole]('link')).toEqual(el);
        el.removeAttribute('href');
        expect(el[symbols.closestRole]('link')).toEqual(el);
      });
    });
  });

  describe('#[findRole]', () => {
    it('finds descendants with explicit roles', () => {
      const el = appendToBody('<div><span role="link" /><p><span role="link" /></p></div>');
      expect(el[symbols.findRole]('link')).toEqual(Array.from(el.querySelectorAll('span')));
    });

    it('finds descendants with multiple role tokens', () => {
      const el = appendToBody('<div><span role="foo link" /></div>');
      expect(el[symbols.findRole]('link')).toEqual([el.querySelector('span')]);
    });

    it('includes itself', () => {
      const el = appendToBody('<span role="link" />');
      expect(el[symbols.findRole]('link')).toEqual([el]);
    });

    it('finds multiple roles', () => {
      const el = appendToBody('<div><span role="link" /><p role="dialog" /></div>');
      expect(el[symbols.findRole](['link', 'dialog'])).toEqual(Array.from(el.childNodes));
    });

    it('finds subclass roles', () => {
      const el = appendToBody('<div role="alertdialog" />');
      expect(el[symbols.findRole]('dialog')).toEqual([el]);
    });

    it('finds exact roles', () => {
      const el = appendToBody('<div role="alertdialog" />');
      expect(el[symbols.findRole]('dialog', { exact: true })).toEqual([]);
    });

    context('implicit roles', () => {
      context('implicit articles', () => {
        it('finds <article>', () => {
          const el = appendToBody('<article />');
          expect(el[symbols.findRole]('article')).toEqual([el]);
        });
      });

      context('implicit banner', () => {
        it('finds <header>', () => {
          const el = appendToBody('<header />');
          expect(el[symbols.findRole]('banner')).toEqual([el]);
        });
      });

      context('implicit button', () => {
        it('finds <button>', () => {
          const el = appendToBody('<button />');
          expect(el[symbols.findRole]('button')).toEqual([el]);
        });

        it('finds <input type="button">', () => {
          const el = appendToBody('<input type="button" />');
          expect(el[symbols.findRole]('button')).toEqual([el]);
        });

        it('finds <summary>', () => {
          const el = appendToBody('<summary />');
          expect(el[symbols.findRole]('button')).toEqual([el]);
        });
      });

      context('implicit cell', () => {
        it('finds <td>', () => {
          const el = appendToBody('<table><tr><td /></tr></table>').querySelector('td');
          expect(el[symbols.findRole]('cell')).toEqual([el]);
        });
      });

      context('implicit checkbox', () => {
        it('finds <input type="checkbox">', () => {
          const el = appendToBody('<input type="checkbox" />');
          expect(el[symbols.findRole]('checkbox')).toEqual([el]);
        });
      });

      context('implicit columnheader', () => {
        it('finds <th>', () => {
          const el = appendToBody('<table><tr><th /></tr></table>').querySelector('th');
          expect(el[symbols.findRole]('columnheader')).toEqual([el]);
        });
      });

      context('implicit combobox', () => {
        it('finds <input list="id">', () => {
          const el = appendToBody('<input list="list-id" /><datalist id="list-id" />');
          expect(el[symbols.findRole]('combobox')).toEqual([el]);
        });
      });

      context('implicit complementary', () => {
        it('finds <aside>', () => {
          const el = appendToBody('<aside />');
          expect(el[symbols.findRole]('complementary')).toEqual([el]);
        });
      });

      context('implicit complementary', () => {
        it('finds <contentinfo>', () => {
          const el = appendToBody('<footer />');
          expect(el[symbols.findRole]('contentinfo')).toEqual([el]);
        });
      });

      context('implicit definition', () => {
        it('finds <dd>', () => {
          const el = appendToBody('<dd />');
          expect(el[symbols.findRole]('definition')).toEqual([el]);
        });
      });

      context('implicit dialog', () => {
        it('finds <dialog>', () => {
          const el = appendToBody('<dialog />');
          expect(el[symbols.findRole]('dialog')).toEqual([el]);
        });
      });

      context('implicit document', () => {
        it('finds <body>', () => {
          expect(document.documentElement[symbols.findRole]('document')).toEqual([document.body]);
        });
      });

      context('implicit form', () => {
        it('finds <form>', () => {
          const el = appendToBody('<form />');
          expect(el[symbols.findRole]('form')).toEqual([el]);
        });
      });

      context('implicit gridcell', () => {
        it('finds <td>', () => {
          const el = appendToBody('<table role="grid"><tr><td /></tr></table>').querySelector('td');
          expect(el[symbols.findRole]('gridcell')).toEqual([el]);
        });
      });

      context('implicit group', () => {
        it('finds <details>', () => {
          const el = appendToBody('<details />');
          expect(el[symbols.findRole]('group')).toEqual([el]);
        });

        it('finds <optgroup>', () => {
          const el = appendToBody('<select><optgroup><option /></optgroup></select>');
          expect(el[symbols.findRole]('group', { exact: true })).toEqual([el.querySelector('optgroup')]);
        });
      });

      context('implicit heading', () => {
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((name) => {
          it(`finds <${name}>`, () => {
            const el = appendToBody(`<${name} />`);
            expect(el[symbols.findRole]('heading')).toEqual([el]);
          });
        });
      });

      context('implicit img', () => {
        it('finds <img>', () => {
          const el = appendToBody('<img alt="foo" />');
          expect(el[symbols.findRole]('img')).toEqual([el]);
        });
      });

      context('implicit link', () => {
        it('finds <a>', () => {
          const el = appendToBody('<a href="#" />');
          expect(el[symbols.findRole]('link')).toEqual([el]);
        });

        it('finds <area>', () => {
          const el = appendToBody('<area href="#" />');
          expect(el[symbols.findRole]('link')).toEqual([el]);
        });

        it('finds <link>', () => {
          const el = appendToBody('<link href="#" />');
          expect(el[symbols.findRole]('link')).toEqual([el]);
        });
      });

      context('implicit list', () => {
        it('finds <dl>', () => {
          const el = appendToBody('<dl />');
          expect(el[symbols.findRole]('list')).toEqual([el]);
        });

        it('finds <ol>', () => {
          const el = appendToBody('<ol />');
          expect(el[symbols.findRole]('list')).toEqual([el]);
        });

        it('finds <ul>', () => {
          const el = appendToBody('<ul />');
          expect(el[symbols.findRole]('list')).toEqual([el]);
        });
      });

      context('implicit listbox', () => {
        it('finds <datalist>', () => {
          const el = appendToBody('<datalist />');
          expect(el[symbols.findRole]('listbox')).toEqual([el]);
        });

        it('finds <select>', () => {
          const el = appendToBody('<select />');
          expect(el[symbols.findRole]('listbox')).toEqual([el]);
        });
      });

      context('implicit listitem', () => {
        it('finds <dt>', () => {
          const el = appendToBody('<dl><dt /></dl>');
          expect(el[symbols.findRole]('listitem')).toEqual([el.querySelector('dt')]);
        });

        it('finds <li>', () => {
          const el = appendToBody('<ul><li /></ul>');
          expect(el[symbols.findRole]('listitem')).toEqual([el.querySelector('li')]);
        });
      });

      context('implicit main', () => {
        it('finds <main>', () => {
          const el = appendToBody('<main />');
          expect(el[symbols.findRole]('main')).toEqual([el]);
        });
      });

      context('implicit menu', () => {
        it('finds <menu>', () => {
          const el = appendToBody('<menu />');
          expect(el[symbols.findRole]('menu')).toEqual([el]);
        });
      });

      context('implicit menuitem', () => {
        it('finds <menuitem>', () => {
          const el = appendToBody('<menuitem />');
          expect(el[symbols.findRole]('menuitem')).toEqual([el]);
        });
      });

      context('implicit menuitemcheckbox', () => {
        it('finds <menuitem type="checkbox">', () => {
          const el = appendToBody('<menuitem type="checkbox" />');
          expect(el[symbols.findRole]('menuitemcheckbox')).toEqual([el]);
        });
      });

      context('implicit menuitemradio', () => {
        it('finds <menuitem type="radio">', () => {
          const el = appendToBody('<menuitem type="radio" />');
          expect(el[symbols.findRole]('menuitemradio')).toEqual([el]);
        });
      });

      context('implicit navigation', () => {
        it('finds <nav>', () => {
          const el = appendToBody('<nav />');
          expect(el[symbols.findRole]('navigation')).toEqual([el]);
        });
      });

      context('implicit option', () => {
        it('finds <option>', () => {
          const el = appendToBody('<select><option /></section>');
          expect(el[symbols.findRole]('option')).toEqual([el.querySelector('option')]);
        });
      });

      context('implicit progressbar', () => {
        it('finds <progress>', () => {
          const el = appendToBody('<progress />');
          expect(el[symbols.findRole]('progressbar')).toEqual([el]);
        });
      });

      context('implicit radio', () => {
        it('finds <input type="radio">', () => {
          const el = appendToBody('<input type="radio" />');
          expect(el[symbols.findRole]('radio')).toEqual([el]);
        });
      });

      context('implicit region', () => {
        it('finds <section>', () => {
          const el = appendToBody('<section aria-label="foo" />');
          expect(el[symbols.findRole]('region')).toEqual([el]);
        });
      });

      context('implicit row', () => {
        it('finds <tr>', () => {
          const el = appendToBody('<table><tr><td /></tr></table>');
          expect(el[symbols.findRole]('row')).toEqual([el.querySelector('tr')]);
        });
      });

      context('implicit rowgroup', () => {
        it('finds <tbody>', () => {
          const el = appendToBody('<table><tbody /></table>');
          expect(el[symbols.findRole]('rowgroup')).toEqual([el.querySelector('tbody')]);
        });

        it('finds <thead>', () => {
          const el = appendToBody('<table><thead /></table>');
          expect(el[symbols.findRole]('rowgroup')).toEqual([el.querySelector('thead')]);
        });

        it('finds <tfoot>', () => {
          const el = appendToBody('<table><tfoot /></table>');
          expect(el[symbols.findRole]('rowgroup')).toEqual([el.querySelector('tfoot')]);
        });
      });

      context('implicit rowheader', () => {
        it('finds <th scope="row" />', () => {
          const el = appendToBody('<table><tr><th scope="row" /></table>');
          expect(el[symbols.findRole]('rowheader')).toEqual([el.querySelector('th')]);
        });
      });

      context('implicit searchbox', () => {
        it('finds <input type="search" />', () => {
          const el = appendToBody('<input type="search" />');
          expect(el[symbols.findRole]('searchbox')).toEqual([el]);
        });
      });

      context('implicit separator', () => {
        it('finds <hr>', () => {
          const el = appendToBody('<hr />');
          expect(el[symbols.findRole]('separator')).toEqual([el]);
        });
      });

      context('implicit slider', () => {
        it('finds <input type="range">', () => {
          const el = appendToBody('<input type="range" />');
          expect(el[symbols.findRole]('slider')).toEqual([el]);
        });
      });

      context('implicit spinbutton', () => {
        it('finds <input type="number">', () => {
          const el = appendToBody('<input type="number" />');
          expect(el[symbols.findRole]('spinbutton')).toEqual([el]);
        });
      });

      context('implicit status', () => {
        it('finds <output>', () => {
          const el = appendToBody('<output />');
          expect(el[symbols.findRole]('status')).toEqual([el]);
        });
      });

      context('implicit table', () => {
        it('finds <table>', () => {
          const el = appendToBody('<table />');
          expect(el[symbols.findRole]('table')).toEqual([el]);
        });
      });

      context('implicit textbox', () => {
        it('finds <input>', () => {
          const el = appendToBody('<input />');
          expect(el[symbols.findRole]('textbox')).toEqual([el]);
        });

        it('finds <textarea>', () => {
          const el = appendToBody('<textarea />');
          expect(el[symbols.findRole]('textbox')).toEqual([el]);
        });
      });
    });

    context('caching', () => {
      it('caches the value', () => {
        ariaExtensions.startCaching();
        const el = appendToBody('<a href="#" />');
        expect(el[symbols.findRole]('link')).toEqual([el]);
        el.removeAttribute('href');
        expect(el[symbols.findRole]('link')).toEqual([el]);
      });
    });
  });
});
