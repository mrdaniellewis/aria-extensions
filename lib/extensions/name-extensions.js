/**
 * Extensions for calculating the accessible name
 */
import ariaExtensions from '../aria-extensions';
import symbol from '../symbol';

// An implementation of the text alternative computation
// https://www.w3.org/TR/accname-aam-1.1/#mapping_additional_nd_te
const controlRoles = ['textbox', 'combobox', 'listbox', 'range'];
const nameFromContentRoles = roles => Object.keys(roles)
  .filter(name => roles[name].nameFromContents);

class AccessibleName {
  constructor(node, options = {}) {
    this.node = node;
    this.role = options.role || node[symbol('role')];
    this.recursion = !!options.recursion;
    this.allowHidden = !!options.allowHidden;
    this.includeHidden = !!options.includeHidden;
    this.noAriaBy = !!options.noAriaBy;
    this.history = options.history || [];
    this.isWithinWidget = 'isWithinWidget' in options ? options.isWithinWidget : this.hasRole('widget');

    this.sequence = [
      () => this.hidden(),
      () => this.ariaBy(),
      () => this.embedded(),
      () => this.ariaLabel(),
      () => this.loop(),
      () => this.native(),
      () => this.dom(),
      () => this.tooltip(),
    ];
  }

  get nodeName() {
    return this._nodeName || (this._nodeName = this.node.nodeName.toLowerCase());
  }

  isInline(node) {
    return ['inline', 'contents'].includes(node[symbol('style')]('display'));
  }

  hasRole(role, options) {
    return ariaExtensions.roleMatches(this.role, role, options);
  }

  build() {
    let text = '';
    this.sequence.some(fn => (text = fn()) != null);

    text = text || '';

    if (!this.recursion) {
      // To a flat string
      text = text.trim().replace(/\s+/g, ' ');
    }

    return text;
  }

  loop() {
    return this.history.includes(this.node) ? '' : null;
  }

  hidden() {
    if (this.includeHidden) {
      return null;
    }
    const isHidden = !this.node[symbol('ariaVisible')];
    if (this.allowHidden && isHidden) {
      this.includeHidden = true;
      return null;
    }
    return isHidden ? '' : null;
  }

  ariaBy(attr = 'labelledby') {
    if (this.noAriaBy) {
      return null;
    }

    const elements = this.node[symbol(attr)];
    if (elements.length) {
      return elements
        .map(elm => this.recurse(elm, { allowHidden: true, noAriaBy: attr === 'labelledby' }))
        .filter(Boolean)
        .join(' ');
    }

    return null;
  }

  ariaLabel() {
    const label = this.node.getAttribute('aria-label');
    if (label && label.trim()) {
      return label;
    }
    return null;
  }

  native(prop = 'nativeLabel') {
    if (['none', 'presentation'].includes(this.role)) {
      return null;
    }

    let native = this.node[symbol('aria')][prop];
    if (typeof native === 'string') {
      return native;
    }
    if (native instanceof HTMLElement) {
      native = [native];
    }
    if (Array.isArray(native)) {
      return native
        .filter(Boolean)
        .map(elm => this.recurse(elm, { allowHidden: true }))
        .join(' ') || null;
    }
    return null;
  }

  embedded() {
    const useEmbeddedName = this.isWithinWidget
      && this.recursion
      && this.hasRole(controlRoles);

    if (!useEmbeddedName) {
      return null;
    }

    const { node, nodeName } = this;

    if (['input', 'textarea'].includes(nodeName) && !this.hasRole('button')) {
      return node.value;
    }

    if (nodeName === 'select') {
      return Array.from(node.selectedOptions)
        .map(option => option.value)
        .join(' ');
    }

    if (this.hasRole('textbox')) {
      return node.textContent;
    }

    if (this.hasRole('combobox')) {
      const input = nodeName === 'input' ? node : node.querySelector('input');
      if (input) {
        return input.value;
      }
      return '';
    }

    if (this.hasRole('listbox')) {
      return node.querySelectorAll('[aria-selected="true"]')
        .map(elm => this.recurse(elm))
        .join(' ');
    }

    if (this.hasRole('range')) {
      return node.getAttribute('aria-valuetext') || node.getAttribute('aria-valuenow') || '';
    }

    return null;
  }

  // Find the label from the dom
  dom() {
    if (!this.recursion
      && !this.hasRole(nameFromContentRoles(ariaExtensions.roles), { exact: true })) {
      return null;
    }

    return Array.from(this.node.childNodes)
      .map((node) => {
        if (node instanceof Text) {
          return node.textContent;
        }
        if (node instanceof Element) {
          const space = this.isInline(node) ? '' : ' ';
          return `${space}${this.recurse(node)}${space}`;
        }
        return null;
      })
      .filter(Boolean)
      .join('') || null;
  }

  // Find a tooltip label
  tooltip() {
    return this.node.title || null;
  }

  recurse(node, options = {}) {
    return new this.constructor(node, Object.assign({
      history: this.history.concat(this.node),
      includeHidden: this.includeHidden,
      noAriaBy: this.noAriaBy,
      recursion: true,
      isWithinWidget: this.isWithinWidget,
      utils: this.utils,
    }, options)).build();
  }
}

class AccessibleDescription extends AccessibleName {
  constructor(node, options) {
    super(node, options);

    this.sequence.unshift(() => this.describedBy());
  }

  describedBy() {
    if (this.recursion) {
      return null;
    }

    if (!this.node[symbol('ariaVisible')]) {
      return '';
    }

    const ariaBy = this.ariaBy('describedby');
    if (ariaBy !== null) {
      return ariaBy;
    }

    return this.native('nativeDescription') || '';
  }
}

ariaExtensions[symbol('extend')](Element.prototype, 'accessibleName', {
  get() {
    return new AccessibleName(this).build();
  },
});

ariaExtensions[symbol('extend')](Element.prototype, 'accessibleDescription', {
  get() {
    return new AccessibleDescription(this).build();
  },
});

// Needed for the section role calculation to  prevent an infinite loop
ariaExtensions[symbol('AccessibleName')] = AccessibleName;
