const Aria = require('./aria');
const { label } = require('./native-label');

module.exports = class AriaSelect extends Aria {
  get implicit() {
    return this.node.size > 1 || this.node.multiple
      ? 'listbox'
      : 'combobox';
  }

  get allowedRoles() {
    return this.node.size > 1 || this.node.multiple
      ? []
      : ['menu'];
  }

  get implicitAttributes() {
    return ['disabled', 'required'];
  }

  get disallowNone() {
    return true;
  }

  get nativeLabel() {
    return label(this.node);
  }
};
