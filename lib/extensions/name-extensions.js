/**
 * Extensions for calculating the accessible name
 */
const ariaExtensions = require('../aria-extensions');
const { extend, AccessibleName: accessibleNameSymbol } = require('../constants');

const { symbols } = ariaExtensions;

// An implementation of the text alternative computation
// https://www.w3.org/TR/accname-aam-1.1/#mapping_additional_nd_te
const controlRoles = ['textbox', 'combobox', 'listbox', 'range'];
const nameFromContentRoles = roles => Object.keys(roles)
  .filter(name => roles[name].nameFromContents);

class AccessibleName {
  constructor(node, options = {}) {
    this.node = node;
    this.role = options.role || node[symbols.role];
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
    const isHidden = !this.node[symbols.ariaVisible];
    if (this.allowHidden && isHidden) {
      this.includeHidden = true;
      return null;
    }
    return isHidden ? '' : null;
  }

  ariaBy(attr = 'aria-labelledby') {
    if (this.noAriaBy) {
      return null;
    }

    const ids = this.node.getAttribute(attr) || '';
    if (ids) {
      return ids.trim().split(/\s+/)
        .map(id => document.getElementById(id))
        .filter(Boolean)
        .map(elm => this.recurse(elm, { allowHidden: true, noAriaBy: attr === 'aria-labelledby' }))
        .filter(Boolean)
        .join(' ');
    }

    return null;
  }

  ariaLabel() {
    return this.node.getAttribute('aria-label') || null;
  }

  native(prop = 'nativeLabel') {
    if (['none', 'presentation'].includes(this.role)) {
      return null;
    }

    let native = this.node[symbols.aria][prop];
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
          return this.recurse(node);
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

    if (!this.node[symbols.ariaVisible]) {
      return '';
    }

    const ariaBy = this.ariaBy('aria-describedby');
    if (ariaBy !== null) {
      return ariaBy;
    }

    return this.native('nativeDescription') || '';
  }
}

ariaExtensions[extend](Element.prototype, 'accessibleName', { get() {
  return new AccessibleName(this).build();
} });

ariaExtensions[extend](Element.prototype, 'accessibleDescription', { get() {
  return new AccessibleDescription(this).build();
} });


// Needed for the section role calculation to  prevent an infinite loop
ariaExtensions[accessibleNameSymbol] = AccessibleName;