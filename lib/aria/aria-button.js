const Aria = require('./aria');
const { label } = require('./native-label');

module.exports = class AriaButton extends Aria {
  get implicit() {
    return 'button';
  }

  get allowedRoles() {
    return this.node.getAttribute('type') === 'menu'
      ? ['menuitem']
      : ['checkbox', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'switch', 'tab'];
  }

  get implicitAttributes() {
    return ['disabled'];
  }

  get disallowNone() {
    return true;
  }

  get nativeLabel() {
    return label(this.node);
  }
};
