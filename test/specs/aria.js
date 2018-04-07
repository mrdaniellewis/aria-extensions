describe('ariaExtensions#[aria]', () => {
  const htmlElements = [
    'html', 'head', 'title', 'base', 'link', 'meta', 'style', 'body', 'article', 'section',
    'nav', 'aside', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'p', 'address', 'hr',
    'pre', 'blockquote', 'ol', 'ul', 'li', 'dl', 'dt', 'dd', 'figure', 'figcaption', 'main',
    'div', 'a', 'em', 'strong', 'small', 's', 'cite', 'q', 'dfn', 'abbr', 'ruby', 'rb', 'rt',
    'rtc', 'rp', 'data', 'time', 'code', 'var', 'samp', 'kbd', 'sub', 'sup', 'i', 'b', 'u',
    'mark', 'bdi', 'bdo', 'span', 'br', 'wbr', 'ins', 'del', 'picture', 'source', 'img',
    'iframe', 'embed', 'object', 'param', 'video', 'audio', 'track', 'map', 'area', 'table',
    'caption', 'colgroup', 'col', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th', 'form', 'label',
    'input', 'button', 'select', 'datalist', 'optgroup', 'option', 'textarea', 'output',
    'progress', 'meter', 'fieldset', 'legend', 'details', 'summary', 'menu', 'menuitem',
    'script', 'noscript', 'template', 'canvas', 'dialog', 'math', 'svg',
  ];

  // Used to tick off elements that have been tested
  const hasSpec = [];

  const allRoles = ExtendedArray.from(Object.keys(ariaExtensions.roles)
    .filter(name => !ariaExtensions.roles[name].abstract));

  const globalAttributes = ExtendedArray.from(['atomic', 'busy', 'controls', 'current', 'describedby', 'details', 'disabled', 'dropeffect', 'errormessage', 'flowto', 'grabbed', 'haspopup', 'hidden', 'invalid', 'keyshortcuts', 'label', 'labelledby', 'live', 'owns', 'relevant', 'roledescription']);

  context('unknown element', () => {
    it('returns the correct data', () => {
      const el = appendToBody('<foo />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: allRoles,
        allowedAttributes: globalAttributes,
        implicitAttributes: [],
      });
    });
  });

  [
    'address', 'canvas', 'data', 'div', 'p', 'pre', 'blockquote', 'ins', 'del', 'span', 'em',
    'strong', 'small', 's', 'cite', 'q', 'dfn', 'abbr', 'time', 'code', 'var', 'samp',
    'kbd', 'sub', 'sup', 'i', 'b', 'u', 'mark', 'ruby', 'rb', 'rt', 'rtc', 'rp', 'bdi', 'bdo',
    'br', 'wbr',
  ].forEach((name) => {
    hasSpec.push(name);

    context(`<${name}>`, () => {
      it('returns the correct data', () => {
        const el = appendToBody(`<${name} />`);
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: allRoles,
          allowedAttributes: globalAttributes,
          implicitAttributes: [],
        });
      });
    });
  });

  ['label', 'legend', 'meter'].forEach((name) => {
    hasSpec.push(name);

    context(`<${name}>`, () => {
      it('returns the correct data', () => {
        const el = appendToBody(`<${name} />`);
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: [],
          allowedAttributes: globalAttributes,
          implicitAttributes: [],
        });
      });
    });
  });

  ['noscript', 'param', 'picture', 'script', 'source', 'style', 'template', 'track'].forEach((name) => {
    hasSpec.push(name);

    context(`<${name}>`, () => {
      it('returns the correct data', () => {
        const el = appendToBody(`<${name} />`);
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: [],
          allowedAttributes: [],
          implicitAttributes: [],
        });
      });
    });
  });

  context('<a>', () => {
    hasSpec.push('a');

    context('with a href', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<a href="#" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'link',
          implicit: 'link',
          allowedRoles: ['button', 'checkbox', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'switch', 'tab', 'treeitem'],
          allowedAttributes: globalAttributes.concat('expanded'),
          implicitAttributes: [],
        });
      });

      ['none', 'presentation'].forEach((role) => {
        it(`disallows ${role}`, () => {
          const el = appendToBody(`<a href="#" role="${role}"/>`);
          expect(el[symbols.role]).toEqual('link');
        });
      });
    });

    context('without a href', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<a />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: allRoles,
          allowedAttributes: globalAttributes,
          implicitAttributes: [],
        });
      });

      ['none', 'presentation'].forEach((role) => {
        it(`allows ${role}`, () => {
          const el = appendToBody(`<a role="${role}"/>`);
          expect(el[symbols.role]).toEqual(role);
        });
      });
    });
  });

  context('<area>', () => {
    hasSpec.push('area');

    context('attached to image map', () => {
      context('with a href', () => {
        it('returns the correct data', () => {
          const id = uniqueId();
          const el = appendToBody(`<map name="${id}"><area href="#" /></map><img usemap="#${id}" src="flower.jpg />`).querySelector('area');
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'link',
            implicit: 'link',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('expanded'),
            implicitAttributes: [],
          });
        });

        ['none', 'presentation'].forEach((role) => {
          it(`disallows ${role}`, () => {
            const id = uniqueId();
            const el = appendToBody(`<map name="${id}"><area href="#" /></map><img usemap="#${id}" src="flower.jpg />`).querySelector('area');
            expect(el[symbols.role]).toEqual('link');
          });
        });
      });

      context('without a href', () => {
        it('returns the correct data', () => {
          const id = uniqueId();
          const el = appendToBody(`<map name="${id}"><area /></map><img usemap="#${id}" src="flower.jpg />`).querySelector('area');
          expect(el[symbols.aria]).toIncludeProperties({
            role: null,
            implicit: null,
            allowedRoles: [],
            allowedAttributes: globalAttributes,
            implicitAttributes: [],
          });
        });

        ['none', 'presentation'].forEach((role) => {
          it(`disallows ${role}`, () => {
            const id = uniqueId();
            const el = appendToBody(`<map name="${id}"><area /></map><img usemap="#${id}" src="flower.jpg />`).querySelector('area');
            expect(el[symbols.role]).toEqual(null);
          });
        });
      });
    });

    context('without valid image map', () => {
      context('with a href', () => {
        it('returns the correct data', () => {
          const el = appendToBody('<area href="#" />');
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'link',
            implicit: 'link',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('expanded'),
            implicitAttributes: [],
          });
        });

        ['none', 'presentation'].forEach((role) => {
          it(`allows ${role}`, () => {
            const el = appendToBody(`<area href="#" role="${role}"/>`);
            expect(el[symbols.role]).toEqual(role);
          });
        });
      });

      context('without a href', () => {
        it('returns the correct data', () => {
          const el = appendToBody('<area />');
          expect(el[symbols.aria]).toIncludeProperties({
            role: null,
            implicit: null,
            allowedRoles: [],
            allowedAttributes: globalAttributes,
            implicitAttributes: [],
          });
        });

        ['none', 'presentation'].forEach((role) => {
          it(`allows ${role}`, () => {
            const el = appendToBody(`<area role="${role}"/>`);
            expect(el[symbols.role]).toEqual(role);
          });
        });
      });
    });
  });

  context('<article>', () => {
    hasSpec.push('article');

    it('returns the correct data', () => {
      const el = appendToBody('<article />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'article',
        implicit: 'article',
        allowedRoles: ['application', 'document', 'feed', 'main', 'none', 'presentation', 'region'],
        allowedAttributes: globalAttributes.concat('expanded', 'posinset', 'setsize'),
        implicitAttributes: [],
      });
    });
  });

  context('<aside>', () => {
    hasSpec.push('aside');

    it('returns the correct data', () => {
      const el = appendToBody('<aside />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'complementary',
        implicit: 'complementary',
        allowedRoles: ['feed', 'none', 'note', 'presentation', 'region', 'search'],
        allowedAttributes: globalAttributes.concat('expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<audio>', () => {
    hasSpec.push('audio');

    it('returns the correct data', () => {
      const el = appendToBody('<audio />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: ['application'],
        allowedAttributes: globalAttributes,
        implicitAttributes: [],
      });
    });
  });

  context('<base>', () => {
    hasSpec.push('base');

    it('returns the correct data', () => {
      const el = appendToBody('<base />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: [],
        allowedAttributes: [],
        implicitAttributes: [],
      });
    });
  });

  context('<body>', () => {
    hasSpec.push('body');

    it('returns the correct data', () => {
      expect(document.body[symbols.aria]).toIncludeProperties({
        role: 'document',
        implicit: 'document',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<button>', () => {
    hasSpec.push('button');

    context('type of menu', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<button type="menu" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'button',
          implicit: 'button',
          allowedRoles: ['menuitem'],
          allowedAttributes: globalAttributes.concat('expanded', 'pressed').not('disabled'),
          implicitAttributes: ['disabled'],
        });
      });
    });

    context('other types', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<button />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'button',
          implicit: 'button',
          allowedRoles: ['checkbox', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'switch', 'tab'],
          allowedAttributes: globalAttributes.concat('expanded', 'pressed').not('disabled'),
          implicitAttributes: ['disabled'],
        });
      });
    });

    context('role resolution', () => {
      ['none', 'presentation'].forEach((role) => {
        it(`disallows ${role}`, () => {
          const el = appendToBody(`<button role="${role}"/>`);
          expect(el[symbols.role]).toEqual('button');
        });
      });
    });
  });

  context('<caption>', () => {
    hasSpec.push('caption');

    it('returns the correct data', () => {
      const el = appendToBody('<table><caption /></table>').querySelector('caption');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: [],
        allowedAttributes: globalAttributes,
        implicitAttributes: [],
      });
    });
  });

  ['col', 'colgroup'].forEach((name) => {
    hasSpec.push(name);

    context(`<${name}>`, () => {
      it('returns the correct data', () => {
        const el = appendToBody(`<table><${name} /></table>`).querySelector(name);
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: [],
          allowedAttributes: [],
          implicitAttributes: [],
        });
      });
    });
  });

  context('<datalist>', () => {
    hasSpec.push('datalist');

    it('returns the correct data', () => {
      const el = appendToBody('<datalist>');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'listbox',
        implicit: 'listbox',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('expanded', 'activedescendant', 'orientation', 'multiselectable', 'readonly', 'required'),
        implicitAttributes: [],
      });
    });
  });

  context('<dd>', () => {
    hasSpec.push('dd');

    it('returns the correct data', () => {
      const el = appendToBody('<dd>');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'definition',
        implicit: 'definition',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<details>', () => {
    hasSpec.push('details');

    it('returns the correct data', () => {
      const el = appendToBody('<details>');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'group',
        implicit: 'group',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('expanded', 'activedescendant'),
        implicitAttributes: [],
      });
    });
  });

  context('<dialog>', () => {
    hasSpec.push('dialog');

    it('returns the correct data', () => {
      const el = appendToBody('<dialog>');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'dialog',
        implicit: 'dialog',
        allowedRoles: ['alertdialog'],
        allowedAttributes: globalAttributes.concat('expanded', 'modal'),
        implicitAttributes: [],
      });
    });
  });

  context('<dl>', () => {
    hasSpec.push('dl');

    it('returns the correct data', () => {
      const el = appendToBody('<dl>');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'list',
        implicit: 'list',
        allowedRoles: ['group', 'none', 'presentation'],
        allowedAttributes: globalAttributes.concat('expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<dt>', () => {
    hasSpec.push('dt');

    it('returns the correct data', () => {
      const el = appendToBody('<dt>');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'listitem',
        implicit: 'listitem',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('expanded', 'level', 'posinset', 'setsize'),
        implicitAttributes: [],
      });
    });

    context('is a child of <dl>', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<dl><dt /></dl').querySelector('dt');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'listitem',
          implicit: 'listitem',
          allowedRoles: [],
          allowedAttributes: globalAttributes.concat('expanded', 'level', 'posinset', 'setsize'),
          implicitAttributes: [],
        });
      });
    });

    ['none', 'presentation'].forEach((role) => {
      context(`has child of a <dl role="${role}">`, () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<dl role="${role}"><dt /></dl`).querySelector('dt');
          expect(el[symbols.aria]).toIncludeProperties({
            role,
            implicit: 'listitem',
            allowedRoles: [],
            allowedAttributes: globalAttributes,
            implicitAttributes: [],
          });
        });
      });
    });
  });

  context('<embed>', () => {
    hasSpec.push('embed');

    it('returns the correct data', () => {
      const el = appendToBody('<embed>');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: ['application', 'document', 'img', 'none', 'presentation'],
        allowedAttributes: globalAttributes,
        implicitAttributes: [],
      });
    });
  });

  context('<figcaption>', () => {
    hasSpec.push('figcaption');

    it('returns the correct data', () => {
      const el = appendToBody('<figcaption>');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: ['group', 'none', 'presentation'],
        allowedAttributes: globalAttributes,
        implicitAttributes: [],
      });
    });
  });

  context('<fieldset>', () => {
    hasSpec.push('fieldset');

    it('returns the correct data', () => {
      const el = appendToBody('<fieldset />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'group',
        implicit: 'group',
        allowedRoles: ['none', 'presentation'],
        allowedAttributes: globalAttributes.concat('activedescendant', 'expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<figure>', () => {
    hasSpec.push('figure');

    it('returns the correct data', () => {
      const el = appendToBody('<figure />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'figure',
        implicit: 'figure',
        allowedRoles: ['group', 'none', 'presentation'],
        allowedAttributes: globalAttributes.concat('expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<footer>', () => {
    hasSpec.push('footer');

    context('global footer', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<footer />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'contentinfo',
          implicit: 'contentinfo',
          allowedRoles: ['group', 'none', 'presentation'],
          allowedAttributes: globalAttributes.concat('expanded'),
          implicitAttributes: [],
        });
      });
    });

    ['article', 'aside', 'main', 'nav', 'section'].forEach((name) => {
      context(`footer within ${name}`, () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<${name}><footer /></${name}>`).querySelector('footer');
          expect(el[symbols.aria]).toIncludeProperties({
            role: null,
            implicit: null,
            allowedRoles: ['group', 'none', 'presentation'],
            allowedAttributes: globalAttributes,
            implicitAttributes: [],
          });
        });
      });
    });
  });

  context('<form>', () => {
    hasSpec.push('form');

    it('returns the correct data', () => {
      const el = appendToBody('<form />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: ['none', 'presentation', 'search'],
        allowedAttributes: globalAttributes,
        implicitAttributes: [],
      });
    });

    it('returns the correct data if the form has an accessible name', () => {
      const el = appendToBody('<form aria-label="foo" />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'form',
        implicit: 'form',
        allowedRoles: ['none', 'presentation', 'search'],
        allowedAttributes: globalAttributes.concat('expanded'),
        implicitAttributes: [],
      });
    });
  });

  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((name) => {
    hasSpec.push(name);

    context(`<${name}>`, () => {
      it('returns the correct data', () => {
        const el = appendToBody(`<${name} />`);
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'heading',
          implicit: 'heading',
          allowedRoles: ['none', 'presentation', 'tab'],
          allowedAttributes: globalAttributes.concat('expanded'),
          implicitAttributes: ['level'],
        });
      });
    });
  });

  context('<head>', () => {
    hasSpec.push('head');

    it('returns the correct data', () => {
      expect(document.head[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: [],
        allowedAttributes: [],
        implicitAttributes: [],
      });
    });
  });

  context('<header>', () => {
    hasSpec.push('header');

    context('global header', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<header />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'banner',
          implicit: 'banner',
          allowedRoles: ['group', 'none', 'presentation'],
          allowedAttributes: globalAttributes.concat('expanded'),
          implicitAttributes: [],
        });
      });
    });

    ['article', 'aside', 'main', 'nav', 'section'].forEach((name) => {
      context(`header within ${name}`, () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<${name}><header /></${name}>`).querySelector('header');
          expect(el[symbols.aria]).toIncludeProperties({
            role: null,
            implicit: null,
            allowedRoles: ['group', 'none', 'presentation'],
            allowedAttributes: globalAttributes,
            implicitAttributes: [],
          });
        });
      });
    });
  });

  context('<hr>', () => {
    hasSpec.push('hr');

    context('when focusable', () => {
      it('returns the correct data with a valid tabindex', () => {
        const el = appendToBody('<hr tabindex="0" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'separator',
          implicit: 'separator',
          allowedRoles: ['none', 'presentation'],
          allowedAttributes: globalAttributes.concat('orientation', 'valuemax', 'valuemin', 'valuenow'),
          implicitAttributes: [],
        });
      });

      it('returns the correct data with a invalid tabindex', () => {
        const el = appendToBody('<hr tabindex="foo" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'separator',
          implicit: 'separator',
          allowedRoles: ['none', 'presentation'],
          allowedAttributes: globalAttributes.concat('orientation'),
          implicitAttributes: [],
        });
      });

      it('returns the correct data with a draggable attribute', () => {
        const el = appendToBody('<hr draggable="true" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'separator',
          implicit: 'separator',
          allowedRoles: ['none', 'presentation'],
          allowedAttributes: globalAttributes.concat('orientation', 'valuemax', 'valuemin', 'valuenow'),
          implicitAttributes: [],
        });
      });
    });

    context('when not focusable', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<hr />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'separator',
          implicit: 'separator',
          allowedRoles: ['none', 'presentation'],
          allowedAttributes: globalAttributes.concat('orientation'),
          implicitAttributes: [],
        });
      });
    });
  });

  context('<html>', () => {
    hasSpec.push('html');

    it('returns the correct data', () => {
      expect(document.documentElement[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: [],
        allowedAttributes: [],
        implicitAttributes: [],
      });
    });
  });

  context('<iframe>', () => {
    hasSpec.push('iframe');

    it('returns the correct data', () => {
      const el = appendToBody('<iframe />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: ['application', 'document', 'img'],
        allowedAttributes: globalAttributes,
        implicitAttributes: [],
      });
    });
  });

  context('<img>', () => {
    hasSpec.push('img');

    context('with alt text', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<img alt="foo" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'img',
          implicit: 'img',
          allowedRoles: allRoles.not('none', 'presentation', 'img'),
          allowedAttributes: globalAttributes.concat('expanded'),
          implicitAttributes: [],
        });
      });
    });

    context('with empty alt text', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<img alt="" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: ['none', 'presentation'],
          allowedAttributes: ['hidden'],
          implicitAttributes: [],
        });
      });
    });

    context('with no alt attribute', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<img />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: ['none', 'presentation'],
          allowedAttributes: ['hidden'],
          implicitAttributes: [],
        });
      });
    });
  });

  context('<input>', () => {
    hasSpec.push('input');

    context('no type', () => {
      context('with a list attribute', () => {
        it('returns the correct data', () => {
          const id = uniqueId();
          const el = appendToBody(`<input list="${id}" /><datalist id="${id}" />`);
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'combobox',
            implicit: 'combobox',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('expanded', 'autocomplete', 'orientation', 'activedescendant').not('disabled'),
            implicitAttributes: ['disabled', 'readonly', 'required'],
          });
        });
      });

      context('without a list attribute', () => {
        it('returns the correct data', () => {
          const el = appendToBody('<input />');
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'textbox',
            implicit: 'textbox',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('activedescendant', 'autocomplete', 'multiline').not('disabled'),
            implicitAttributes: ['disabled', 'readonly', 'required', 'placeholder'],
          });
        });
      });
    });

    context('unknown type', () => {
      context('with a list attribute', () => {
        it('returns the correct data', () => {
          const id = uniqueId();
          const el = appendToBody(`<input list="${id}" type="foo" /><datalist id="${id}" />`);
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'combobox',
            implicit: 'combobox',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('expanded', 'autocomplete', 'orientation', 'activedescendant').not('disabled'),
            implicitAttributes: ['disabled', 'readonly', 'required'],
          });
        });
      });

      context('without a list attribute', () => {
        it('returns the correct data', () => {
          const el = appendToBody('<input type="foo" />');
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'textbox',
            implicit: 'textbox',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('activedescendant', 'autocomplete', 'multiline').not('disabled'),
            implicitAttributes: ['disabled', 'placeholder', 'readonly', 'required'],
          });
        });
      });
    });

    context('type of button', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<input type="button" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'button',
          implicit: 'button',
          allowedRoles: ['link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'switch', 'tab'],
          allowedAttributes: globalAttributes.concat('expanded', 'pressed').not('disabled'),
          implicitAttributes: ['disabled'],
        });
      });
    });

    context('type of checkbox', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<input type="checkbox" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'checkbox',
          implicit: 'checkbox',
          allowedRoles: ['button', 'menuitemcheckbox', 'option', 'switch'],
          allowedAttributes: globalAttributes.concat('readonly').not('disabled'),
          implicitAttributes: ['disabled', 'checked', 'required'],
        });
      });
    });

    context('type of color', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<input type="color" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: [],
          allowedAttributes: globalAttributes.not('disabled'),
          implicitAttributes: ['disabled'],
        });
      });
    });

    ['date', 'datetime', 'datetime-local', 'month', 'time', 'week'].forEach((name) => {
      context(`type of ${name}`, () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<input type="${name}" />`);
          expect(el[symbols.aria]).toIncludeProperties({
            role: null,
            implicit: null,
            allowedRoles: [],
            allowedAttributes: globalAttributes.not('disabled', 'required', 'readonly'),
            implicitAttributes: ['disabled', 'required', 'readonly'],
          });
        });
      });
    });

    context('type of file', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<input type="file" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: [],
          allowedAttributes: globalAttributes.not('disabled', 'required'),
          implicitAttributes: ['disabled', 'required'],
        });
      });
    });

    context('type of password', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<input type="password" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: [],
          allowedAttributes: globalAttributes.not('disabled', 'required', 'placeholder', 'readonly'),
          implicitAttributes: ['disabled', 'required', 'placeholder', 'readonly'],
        });
      });
    });

    ['email', 'url', 'tel', 'text'].forEach((name) => {
      context(`type of ${name}`, () => {
        context('with a list attribute', () => {
          it('returns the correct data', () => {
            const id = uniqueId();
            const el = appendToBody(`<input list="${id}" type="${name}" /><datalist id="${id}" />`);
            expect(el[symbols.aria]).toIncludeProperties({
              role: 'combobox',
              implicit: 'combobox',
              allowedRoles: [],
              allowedAttributes: globalAttributes.concat('expanded', 'autocomplete', 'orientation', 'activedescendant').not('disabled'),
              implicitAttributes: ['disabled', 'required', 'readonly'],
            });
          });
        });

        context('without a list attribute', () => {
          it('returns the correct data', () => {
            const el = appendToBody(`<input type="${name}" />`);
            expect(el[symbols.aria]).toIncludeProperties({
              role: 'textbox',
              implicit: 'textbox',
              allowedRoles: [],
              allowedAttributes: globalAttributes.concat('activedescendant', 'autocomplete', 'multiline').not('disabled'),
              implicitAttributes: ['disabled', 'required', 'readonly', 'placeholder'],
            });
          });
        });
      });
    });

    context('type of hidden', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<input type="hidden" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: [],
          allowedAttributes: [],
          implicitAttributes: [],
        });
      });
    });

    context('type of image', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<input type="image" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'button',
          implicit: 'button',
          allowedRoles: ['link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'radio', 'switch'],
          allowedAttributes: globalAttributes.concat('pressed', 'expanded').not('disabled'),
          implicitAttributes: ['disabled'],
        });
      });
    });

    context('type of number', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<input type="number" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'spinbutton',
          implicit: 'spinbutton',
          allowedRoles: [],
          allowedAttributes: globalAttributes.concat('valuetext', 'activedescendant', 'valuemax', 'valuemin', 'valuenow').not('disabled'),
          implicitAttributes: ['disabled', 'readonly', 'required'],
        });
      });
    });

    context('type of radio', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<input type="radio" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'radio',
          implicit: 'radio',
          allowedRoles: ['menuitemradio'],
          allowedAttributes: globalAttributes.concat('posinset', 'setsize').not('disabled'),
          implicitAttributes: ['checked', 'disabled'],
        });
      });
    });

    context('type of range', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<input type="range" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'slider',
          implicit: 'slider',
          allowedRoles: [],
          allowedAttributes: globalAttributes.concat('valuetext', 'valuemax', 'valuemin', 'valuenow', 'orientation', 'readonly').not('disabled'),
          implicitAttributes: ['disabled'],
        });
      });
    });

    ['reset', 'submit'].forEach((name) => {
      context(`type of ${name}`, () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<input type="${name}" />`);
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'button',
            implicit: 'button',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('pressed', 'expanded').not('disabled'),
            implicitAttributes: ['disabled'],
          });
        });
      });
    });

    context('type of search', () => {
      context('with a list attribute', () => {
        it('returns the correct data', () => {
          const id = uniqueId();
          const el = appendToBody(`<input list="${id}" type="search" /><datalist id="${id}" />`);
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'combobox',
            implicit: 'combobox',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('expanded', 'autocomplete', 'orientation', 'activedescendant').not('disabled'),
            implicitAttributes: ['disabled', 'readonly', 'required'],
          });
        });
      });

      context('without a list attribute', () => {
        it('returns the correct data', () => {
          const el = appendToBody('<input type="search" />');
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'searchbox',
            implicit: 'searchbox',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('activedescendant', 'autocomplete', 'multiline').not('disabled'),
            implicitAttributes: ['disabled', 'readonly', 'required', 'placeholder'],
          });
        });
      });
    });

    context('role resolution', () => {
      ['none', 'presentation'].forEach((role) => {
        context('type of hidden', () => {
          it(`allows ${role}`, () => {
            const el = appendToBody(`<input type="hidden" role="${role}"/>`);
            expect(el[symbols.role]).toEqual(role);
          });
        });

        context('other types', () => {
          it(`disallows ${role}`, () => {
            const el = appendToBody(`<input role="${role}"/>`);
            expect(el[symbols.role]).toEqual('textbox');
          });
        });
      });
    });
  });

  context('<li>', () => {
    hasSpec.push('li');

    it('returns the correct data', () => {
      const el = appendToBody('<li />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'listitem',
        implicit: 'listitem',
        allowedRoles: ['menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'none', 'presentation', 'radio', 'separator', 'tab', 'treeitem'],
        allowedAttributes: globalAttributes.concat('expanded', 'level', 'posinset', 'setsize'),
        implicitAttributes: [],
      });
    });

    ['ol', 'ul'].forEach((name) => {
      context(`is a child of <${name}>`, () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<${name}><li /></${name}`).querySelector('li');
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'listitem',
            implicit: 'listitem',
            allowedRoles: ['menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'none', 'presentation', 'radio', 'separator', 'tab', 'treeitem'],
            allowedAttributes: globalAttributes.concat('expanded', 'level', 'posinset', 'setsize'),
            implicitAttributes: [],
          });
        });
      });

      ['none', 'presentation'].forEach((role) => {
        context(`has child of a <${name} role="${role}">`, () => {
          it('returns the correct data', () => {
            const el = appendToBody(`<${name} role="${role}"><li /></${name}`).querySelector('li');
            expect(el[symbols.aria]).toIncludeProperties({
              role,
              implicit: 'listitem',
              allowedRoles: ['menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'none', 'presentation', 'radio', 'separator', 'tab', 'treeitem'],
              allowedAttributes: globalAttributes,
              implicitAttributes: [],
            });
          });
        });
      });
    });
  });

  context('<link>', () => {
    hasSpec.push('link');

    context('with a href', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<link href="#" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'link',
          implicit: 'link',
          allowedRoles: [],
          allowedAttributes: [],
          implicitAttributes: [],
        });
      });
    });

    context('without a href', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<link />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: [],
          allowedAttributes: [],
          implicitAttributes: [],
        });
      });
    });
  });

  context('<main>', () => {
    hasSpec.push('main');

    it('returns the correct data', () => {
      const el = appendToBody('<main />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'main',
        implicit: 'main',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<map>', () => {
    hasSpec.push('map');

    it('returns the correct data', () => {
      const el = appendToBody('<map />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: [],
        allowedAttributes: [],
        implicitAttributes: [],
      });
    });
  });

  context('<math>', () => {
    hasSpec.push('math');

    it('returns the correct data', () => {
      const el = appendToBody('<math />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'math',
        implicit: 'math',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<menu>', () => {
    hasSpec.push('menu');

    it('returns the correct data', () => {
      const el = appendToBody('<menu />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'menu',
        implicit: 'menu',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('activedescendant', 'orientation', 'expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<menuitem>', () => {
    hasSpec.push('menuitem');

    context('no type', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<menuitem />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'menuitem',
          implicit: 'menuitem',
          allowedRoles: [],
          allowedAttributes: globalAttributes.concat('expanded', 'posinset', 'setsize'),
          implicitAttributes: [],
        });
      });

      context('child of a menu', () => {
        it('returns the correct data', () => {
          const el = appendToBody('<menu><menuitem /></menu>').querySelector('menuitem');
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'menuitem',
            implicit: 'menuitem',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('expanded', 'posinset', 'setsize'),
            implicitAttributes: [],
          });
        });
      });

      ['none', 'presentation'].forEach((role) => {
        context(`child of a <menu role="${role}">`, () => {
          it('returns the correct data', () => {
            const el = appendToBody(`<menu role="${role}"><menuitem /></menu>`).querySelector('menuitem');
            expect(el[symbols.aria]).toIncludeProperties({
              role,
              implicit: 'menuitem',
              allowedRoles: [],
              allowedAttributes: globalAttributes,
              implicitAttributes: [],
            });
          });
        });
      });
    });

    context('type of command', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<menuitem type="command" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'menuitem',
          implicit: 'menuitem',
          allowedRoles: [],
          allowedAttributes: globalAttributes.concat('expanded', 'posinset', 'setsize'),
          implicitAttributes: [],
        });
      });

      context('child of a menu', () => {
        it('returns the correct data', () => {
          const el = appendToBody('<menu><menuitem type="command" /></menu>').querySelector('menuitem');
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'menuitem',
            implicit: 'menuitem',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('expanded', 'posinset', 'setsize'),
            implicitAttributes: [],
          });
        });
      });

      ['none', 'presentation'].forEach((role) => {
        context(`child of a <menu role="${role}">`, () => {
          it('returns the correct data', () => {
            const el = appendToBody(`<menu role="${role}"><menuitem type="command" /></menu>`).querySelector('menuitem');
            expect(el[symbols.aria]).toIncludeProperties({
              role,
              implicit: 'menuitem',
              allowedRoles: [],
              allowedAttributes: globalAttributes,
              implicitAttributes: [],
            });
          });
        });
      });
    });

    context('type of checkbox', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<menuitem type="checkbox" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'menuitemcheckbox',
          implicit: 'menuitemcheckbox',
          allowedRoles: [],
          allowedAttributes: globalAttributes.concat('expanded', 'posinset', 'setsize', 'checked', 'readonly'),
          implicitAttributes: [],
        });
      });

      context('child of a menu', () => {
        it('returns the correct data', () => {
          const el = appendToBody('<menu><menuitem type="checkbox" /></menu>').querySelector('menuitem');
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'menuitemcheckbox',
            implicit: 'menuitemcheckbox',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('expanded', 'posinset', 'setsize', 'checked', 'readonly'),
            implicitAttributes: [],
          });
        });
      });

      ['none', 'presentation'].forEach((role) => {
        context(`child of a <menu role="${role}">`, () => {
          it('returns the correct data', () => {
            const el = appendToBody(`<menu role="${role}"><menuitem type="checkbox" /></menu>`).querySelector('menuitem');
            expect(el[symbols.aria]).toIncludeProperties({
              role,
              implicit: 'menuitemcheckbox',
              allowedRoles: [],
              allowedAttributes: globalAttributes,
              implicitAttributes: [],
            });
          });
        });
      });
    });

    context('type of radio', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<menuitem type="radio" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'menuitemradio',
          implicit: 'menuitemradio',
          allowedRoles: [],
          allowedAttributes: globalAttributes.concat('expanded', 'posinset', 'setsize', 'checked', 'readonly'),
          implicitAttributes: [],
        });
      });

      context('child of a menu', () => {
        it('returns the correct data', () => {
          const el = appendToBody('<menu><menuitem type="radio" /></menu>').querySelector('menuitem');
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'menuitemradio',
            implicit: 'menuitemradio',
            allowedRoles: [],
            allowedAttributes: globalAttributes.concat('expanded', 'posinset', 'setsize', 'checked', 'readonly'),
            implicitAttributes: [],
          });
        });
      });

      ['none', 'presentation'].forEach((role) => {
        context(`child of a <menu role="${role}">`, () => {
          it('returns the correct data', () => {
            const el = appendToBody(`<menu role="${role}"><menuitem type="radio" /></menu>`).querySelector('menuitem');
            expect(el[symbols.aria]).toIncludeProperties({
              role,
              implicit: 'menuitemradio',
              allowedRoles: [],
              allowedAttributes: globalAttributes,
              implicitAttributes: [],
            });
          });
        });
      });
    });
  });

  context('<meta>', () => {
    hasSpec.push('meta');

    it('returns the correct data', () => {
      const el = appendToBody('<meta />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: [],
        allowedAttributes: [],
        implicitAttributes: [],
      });
    });
  });

  context('<nav>', () => {
    hasSpec.push('nav');

    it('returns the correct data', () => {
      const el = appendToBody('<nav />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'navigation',
        implicit: 'navigation',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<object>', () => {
    hasSpec.push('object');

    it('returns the correct data', () => {
      const el = appendToBody('<object />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: ['application', 'document', 'img'],
        allowedAttributes: globalAttributes,
        implicitAttributes: [],
      });
    });
  });

  context('<ol>', () => {
    hasSpec.push('ol');

    it('returns the correct data', () => {
      const el = appendToBody('<ol />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'list',
        implicit: 'list',
        allowedRoles: ['directory', 'group', 'listbox', 'menu', 'menubar', 'none', 'presentation', 'radiogroup', 'tablist', 'toolbar', 'tree'],
        allowedAttributes: globalAttributes.concat('expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<optgroup>', () => {
    hasSpec.push('optgroup');

    it('returns the correct data', () => {
      const el = appendToBody('<optgroup />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'group',
        implicit: 'group',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('expanded', 'activedescendant'),
        implicitAttributes: [],
      });
    });
  });

  context('<option>', () => {
    hasSpec.push('option');

    it('returns the correct data', () => {
      const el = appendToBody('<option />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'option',
        implicit: 'option',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('selected', 'checked', 'posinset', 'setsize'),
        implicitAttributes: [],
      });
    });

    context('child of a <datalist>', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<datalist><option /></datalist>').querySelector('option');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'option',
          implicit: 'option',
          allowedRoles: [],
          allowedAttributes: globalAttributes.concat('selected', 'checked', 'posinset', 'setsize'),
          implicitAttributes: [],
        });
      });
    });

    ['none', 'presentation'].forEach((role) => {
      context(`child of a <datalist role="${role}">`, () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<datalist role="${role}"><option /></datalist>`).querySelector('option');
          expect(el[symbols.aria]).toIncludeProperties({
            role,
            implicit: 'option',
            allowedRoles: [],
            allowedAttributes: globalAttributes,
            implicitAttributes: [],
          });
        });
      });
    });
  });

  context('<output>', () => {
    hasSpec.push('output');

    it('returns the correct data', () => {
      const el = appendToBody('<output />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'status',
        implicit: 'status',
        allowedRoles: allRoles.not('status'),
        allowedAttributes: globalAttributes.concat('expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<progress>', () => {
    hasSpec.push('progress');

    it('returns the correct data', () => {
      const el = appendToBody('<progress />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'progressbar',
        implicit: 'progressbar',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('valuetext', 'valuemax', 'valuemin', 'valuenow'),
        implicitAttributes: [],
      });
    });
  });

  context('<section>', () => {
    hasSpec.push('section');

    context('has an accessible name', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<section title="foo" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'region',
          implicit: 'region',
          allowedRoles: ['alert', 'alertdialog', 'application', 'banner', 'complementary', 'contentinfo', 'dialog', 'document', 'feed', 'log', 'main', 'marquee', 'navigation', 'none', 'presentation', 'search', 'status', 'tabpanel'],
          allowedAttributes: globalAttributes.concat('expanded'),
          implicitAttributes: [],
        });
      });
    });

    context('does not have an accessible name', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<section />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: null,
          implicit: null,
          allowedRoles: ['alert', 'alertdialog', 'application', 'banner', 'complementary', 'contentinfo', 'dialog', 'document', 'feed', 'log', 'main', 'marquee', 'navigation', 'none', 'presentation', 'search', 'status', 'tabpanel'],
          allowedAttributes: globalAttributes,
          implicitAttributes: [],
        });
      });
    });
  });

  context('<select>', () => {
    hasSpec.push('select');

    context('as a combobox', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<select />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'combobox',
          implicit: 'combobox',
          allowedRoles: ['menu'],
          allowedAttributes: globalAttributes.concat('autocomplete', 'activedescendant', 'expanded', 'orientation', 'readonly').not('disabled'),
          implicitAttributes: ['disabled', 'required'],
        });
      });

      it('returns the correct data with a size of 1', () => {
        const el = appendToBody('<select size="1" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'combobox',
          implicit: 'combobox',
          allowedRoles: ['menu'],
          allowedAttributes: globalAttributes.concat('autocomplete', 'activedescendant', 'expanded', 'orientation', 'readonly').not('disabled'),
          implicitAttributes: ['disabled', 'required'],
        });
      });
    });

    context('as a listbox', () => {
      it('returns the correct data with the multiple attribute', () => {
        const el = appendToBody('<select multiple />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'listbox',
          implicit: 'listbox',
          allowedRoles: [],
          allowedAttributes: globalAttributes.concat('activedescendant', 'expanded', 'orientation', 'multiselectable', 'readonly').not('disabled'),
          implicitAttributes: ['disabled', 'required'],
        });
      });

      it('returns the correct data with the size attribute', () => {
        const el = appendToBody('<select size="2" />');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'listbox',
          implicit: 'listbox',
          allowedRoles: [],
          allowedAttributes: globalAttributes.concat('activedescendant', 'expanded', 'orientation', 'multiselectable', 'readonly').not('disabled'),
          implicitAttributes: ['disabled', 'required'],
        });
      });
    });

    context('role resolution', () => {
      ['none', 'presentation'].forEach((role) => {
        it(`disallows ${role}`, () => {
          const el = appendToBody(`<select role="${role}"/>`);
          expect(el[symbols.role]).toEqual('combobox');
        });
      });
    });
  });

  context('<svg>', () => {
    hasSpec.push('svg');

    it('returns the correct data', () => {
      const el = appendToBody('<svg />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: ['application', 'document', 'img'],
        allowedAttributes: globalAttributes,
        implicitAttributes: [],
      });
    });
  });

  context('<summary>', () => {
    hasSpec.push('summary');

    it('returns the correct data', () => {
      const el = appendToBody('<summary />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'button',
        implicit: 'button',
        allowedRoles: ['button'],
        allowedAttributes: globalAttributes.concat('expanded', 'pressed'),
        implicitAttributes: [],
      });
    });
  });

  context('<table>', () => {
    hasSpec.push('table');

    it('returns the correct data', () => {
      const el = appendToBody('<table />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'table',
        implicit: 'table',
        allowedRoles: allRoles.not('table'),
        allowedAttributes: globalAttributes.concat('expanded', 'colcount', 'rowcount'),
        implicitAttributes: [],
      });
    });
  });

  context('<textarea>', () => {
    hasSpec.push('textarea');

    it('returns the correct data', () => {
      const el = appendToBody('<textarea />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'textbox',
        implicit: 'textbox',
        allowedRoles: [],
        allowedAttributes: globalAttributes.concat('activedescendant', 'autocomplete', 'multiline').not('disabled'),
        implicitAttributes: ['disabled', 'readonly', 'required', 'placeholder'],
      });
    });

    context('role resolution', () => {
      ['none', 'presentation'].forEach((role) => {
        it(`disallows ${role}`, () => {
          const el = appendToBody(`<textarea role="${role}" />`);
          expect(el[symbols.role]).toEqual('textbox');
        });
      });
    });
  });

  ['thead', 'tbody', 'tfoot'].forEach((name) => {
    hasSpec.push(name);

    context(`<${name}>`, () => {
      context('implicit table ancestor', () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<table><${name} /></table>`).querySelector(name);
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'rowgroup',
            implicit: 'rowgroup',
            allowedRoles: allRoles.not('rowgroup'),
            allowedAttributes: globalAttributes,
            implicitAttributes: [],
          });
        });
      });

      context('other role ancestor', () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<table role="link"><${name} /></table>`).querySelector(name);
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'rowgroup',
            implicit: 'rowgroup',
            allowedRoles: allRoles.not('rowgroup'),
            allowedAttributes: globalAttributes,
            implicitAttributes: [],
          });
        });
      });

      context('explicit table ancestor', () => {
        ['table', 'grid', 'treegrid'].forEach((role) => {
          context(role, () => {
            it('returns the correct data', () => {
              const el = appendToBody(`<table role="${role}"><${name} /></table>`).querySelector(name);
              expect(el[symbols.aria]).toIncludeProperties({
                role: 'rowgroup',
                implicit: 'rowgroup',
                allowedRoles: allRoles.not('rowgroup'),
                allowedAttributes: globalAttributes,
                implicitAttributes: [],
              });
            });
          });
        });
      });

      ['none', 'presentation'].forEach((role) => {
        context(`table ancestor with a role of ${role}`, () => {
          it('returns the correct data', () => {
            const el = appendToBody(`<table role="${role}"><${name}><tr><td /></tr></${name}></table>`).querySelector(name);
            expect(el[symbols.aria]).toIncludeProperties({
              role,
              implicit: 'rowgroup',
              allowedRoles: allRoles.not('rowgroup'),
              allowedAttributes: globalAttributes,
              implicitAttributes: [],
            });
          });
        });
      });
    });
  });

  context('<td>', () => {
    hasSpec.push('td');

    ['grid', 'treegrid'].forEach((name) => {
      context(`when a table has a role of ${name}`, () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<table role="${name}"><tr><td /></tr><table>`).querySelector('td');
          expect(el[symbols.aria]).toIncludeProperties({
            role: 'gridcell',
            implicit: 'gridcell',
            allowedRoles: allRoles.not('gridcell'),
            allowedAttributes: globalAttributes.concat('expanded', 'colindex', 'colspan', 'rowindex', 'rowspan', 'readonly', 'required', 'selected'),
            implicitAttributes: [],
          });
        });
      });
    });

    context('when a table has a role of table', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<table><tr><td /></tr><table>').querySelector('td');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'cell',
          implicit: 'cell',
          allowedRoles: allRoles.not('cell'),
          allowedAttributes: globalAttributes.concat('expanded', 'colindex', 'colspan', 'rowindex', 'rowspan'),
          implicitAttributes: [],
        });
      });
    });

    context('when a table has another role', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<table role="list"><tr><td /></tr><table>').querySelector('td');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'cell',
          implicit: 'cell',
          allowedRoles: allRoles.not('cell'),
          allowedAttributes: globalAttributes.concat('expanded', 'colindex', 'colspan', 'rowindex', 'rowspan'),
          implicitAttributes: [],
        });
      });
    });

    ['none', 'presentation'].forEach((role) => {
      context(`table ancestor with a role of ${role}`, () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<table role="${role}"><tr><td /></tr></table>`).querySelector('td');
          expect(el[symbols.aria]).toIncludeProperties({
            role,
            implicit: 'cell',
            allowedRoles: allRoles.not('cell'),
            allowedAttributes: globalAttributes,
            implicitAttributes: [],
          });
        });
      });
    });
  });

  context('<th>', () => {
    hasSpec.push('th');

    context('implicit table ancestor', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<table><tr><th /></tr></table>').querySelector('th');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'columnheader',
          implicit: 'columnheader',
          allowedRoles: allRoles.not('columnheader'),
          allowedAttributes: globalAttributes.concat('expanded', 'colindex', 'colspan', 'rowindex', 'rowspan', 'readonly', 'required', 'selected', 'sort'),
          implicitAttributes: [],
        });
      });

      ['col', 'colgroup'].forEach((scope) => {
        context(`scope of ${scope}`, () => {
          it('returns the correct data', () => {
            const el = appendToBody(`<table><tr><th scope="${scope}" /></tr></table>`).querySelector('th');
            expect(el[symbols.aria]).toIncludeProperties({
              role: 'columnheader',
              implicit: 'columnheader',
              allowedRoles: allRoles.not('columnheader'),
              allowedAttributes: globalAttributes.concat('expanded', 'colindex', 'colspan', 'rowindex', 'rowspan', 'readonly', 'required', 'selected', 'sort'),
              implicitAttributes: [],
            });
          });
        });
      });

      ['row', 'rowgroup'].forEach((scope) => {
        context(`scope of ${scope}`, () => {
          it('returns the correct data', () => {
            const el = appendToBody(`<table><tr><th scope="${scope}" /></tr></table>`).querySelector('th');
            expect(el[symbols.aria]).toIncludeProperties({
              role: 'rowheader',
              implicit: 'rowheader',
              allowedRoles: allRoles.not('rowheader'),
              allowedAttributes: globalAttributes.concat('expanded', 'colindex', 'colspan', 'rowindex', 'rowspan', 'readonly', 'required', 'selected', 'sort'),
              implicitAttributes: [],
            });
          });
        });
      });
    });

    context('other role ancestor', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<table role="link"><tr><th /></tr></table>').querySelector('th');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'columnheader',
          implicit: 'columnheader',
          allowedRoles: allRoles.not('columnheader'),
          allowedAttributes: globalAttributes.concat('expanded', 'colindex', 'colspan', 'rowindex', 'rowspan', 'readonly', 'required', 'selected', 'sort'),
          implicitAttributes: [],
        });
      });
    });

    context('explicit table ancestor', () => {
      ['table', 'grid', 'treegrid'].forEach((role) => {
        context(role, () => {
          it('returns the correct data', () => {
            const el = appendToBody(`<table role="${role}"><tr><th /></tr></table>`).querySelector('th');
            expect(el[symbols.aria]).toIncludeProperties({
              role: 'columnheader',
              implicit: 'columnheader',
              allowedRoles: allRoles.not('columnheader'),
              allowedAttributes: globalAttributes.concat('expanded', 'colindex', 'colspan', 'rowindex', 'rowspan', 'readonly', 'required', 'selected', 'sort'),
              implicitAttributes: [],
            });
          });
        });
      });
    });

    ['none', 'presentation'].forEach((role) => {
      context(`table ancestor with a role of ${role}`, () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<table role="${role}"><tr><th /></tr></table>`).querySelector('th');
          expect(el[symbols.aria]).toIncludeProperties({
            role,
            implicit: 'columnheader',
            allowedRoles: allRoles.not('columnheader'),
            allowedAttributes: globalAttributes,
            implicitAttributes: [],
          });
        });
      });
    });
  });

  context('<title>', () => {
    hasSpec.push('title');

    it('returns the correct data', () => {
      expect(document.querySelector('title')[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: [],
        allowedAttributes: [],
        implicitAttributes: [],
      });
    });
  });

  context('<tr>', () => {
    hasSpec.push('tr');

    context('implicit table ancestor', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<table><tr><td /></tr></table>').querySelector('tr');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'row',
          implicit: 'row',
          allowedRoles: allRoles.not('row'),
          allowedAttributes: globalAttributes.concat('activedescendant', 'expanded', 'colindex', 'level', 'rowindex', 'selected'),
          implicitAttributes: [],
        });
      });
    });

    context('other role ancestor', () => {
      it('returns the correct data', () => {
        const el = appendToBody('<table role="link"><tr><td /></tr></table>').querySelector('tr');
        expect(el[symbols.aria]).toIncludeProperties({
          role: 'row',
          implicit: 'row',
          allowedRoles: allRoles.not('row'),
          allowedAttributes: globalAttributes.concat('activedescendant', 'expanded', 'colindex', 'level', 'rowindex', 'selected'),
          implicitAttributes: [],
        });
      });
    });

    context('explicit table ancestor', () => {
      ['table', 'grid', 'treegrid'].forEach((role) => {
        context(role, () => {
          it('returns the correct data', () => {
            const el = appendToBody(`<table role="${role}"><tr><td /></tr></table>`).querySelector('tr');
            expect(el[symbols.aria]).toIncludeProperties({
              role: 'row',
              implicit: 'row',
              allowedRoles: allRoles.not('row'),
              allowedAttributes: globalAttributes.concat('activedescendant', 'expanded', 'colindex', 'level', 'rowindex', 'selected'),
              implicitAttributes: [],
            });
          });
        });
      });
    });

    ['none', 'presentation'].forEach((role) => {
      context(`table ancestor with a role of ${role}`, () => {
        it('returns the correct data', () => {
          const el = appendToBody(`<table role="${role}"><tr><td /></tr></table>`).querySelector('tr');
          expect(el[symbols.aria]).toIncludeProperties({
            role,
            implicit: 'row',
            allowedRoles: allRoles.not('row'),
            allowedAttributes: globalAttributes,
            implicitAttributes: [],
          });
        });
      });
    });
  });

  context('<ul>', () => {
    hasSpec.push('ul');

    it('returns the correct data', () => {
      const el = appendToBody('<ul />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: 'list',
        implicit: 'list',
        allowedRoles: ['directory', 'group', 'listbox', 'menu', 'menubar', 'none', 'presentation', 'radiogroup', 'tablist', 'toolbar', 'tree'],
        allowedAttributes: globalAttributes.concat('expanded'),
        implicitAttributes: [],
      });
    });
  });

  context('<video>', () => {
    hasSpec.push('video');

    it('returns the correct data', () => {
      const el = appendToBody('<video />');
      expect(el[symbols.aria]).toIncludeProperties({
        role: null,
        implicit: null,
        allowedRoles: ['application'],
        allowedAttributes: globalAttributes,
        implicitAttributes: [],
      });
    });
  });

  context('test validation', () => {
    it('has a spec for each element', () => {
      expect(hasSpec).toMatchArray(htmlElements);
    });
  });

  describe('#explicit', () => {
    it('is null if no role is specified', () => {
      const el = appendToBody('<input />');
      expect(el[symbols.aria].explicit).toEqual(null);
    });

    it('is the specified role', () => {
      const el = appendToBody('<input role="dialog" />');
      expect(el[symbols.aria].explicit).toEqual('dialog');
    });

    it('ignores unknown roles', () => {
      const el = appendToBody('<input role="foo dialog" />');
      expect(el[symbols.aria].explicit).toEqual('dialog');
    });

    it('ignores abstract roles', () => {
      const el = appendToBody('<input role="command dialog" />');
      expect(el[symbols.aria].explicit).toEqual('dialog');
    });

    it('does not ignore invalid none', () => {
      const el = appendToBody('<input role="none" />');
      expect(el[symbols.aria].explicit).toEqual('none');
    });
  });

  describe('#inherited', () => {
    it('is null if no role is specified', () => {
      const el = appendToBody('<input />');
      expect(el[symbols.aria].inherited).toEqual(null);
    });

    it('is null if there is no role', () => {
      const el = appendToBody('<div />');
      expect(el[symbols.aria].inherited).toEqual(null);
    });

    it('is null if an owned element does not inherit none', () => {
      const el = appendToBody('<ul><li /></ul>').querySelector('li');
      expect(el[symbols.aria].inherited).toEqual(null);
    });

    it('is null if an owned element use of none is invalid', () => {
      const el = appendToBody('<ul role="none" aria-invalid="true"><li /></ul>').querySelector('li');
      expect(el[symbols.aria].inherited).toEqual(null);
    });

    it('is none if an owned element has an owner with none', () => {
      const el = appendToBody('<ul role="none"><li /></ul>').querySelector('li');
      expect(el[symbols.aria].inherited).toEqual('none');
    });

    it('is presentation if an owned element has an owner with presentation', () => {
      const el = appendToBody('<ul role="presentation"><li /></ul>').querySelector('li');
      expect(el[symbols.aria].inherited).toEqual('presentation');
    });

    it('inherits through multiple owned elements', () => {
      const el = appendToBody('<table role="none"><tr><td /></tr></table>').querySelector('td');
      expect(el[symbols.aria].inherited).toEqual('none');
    });
  });
});
