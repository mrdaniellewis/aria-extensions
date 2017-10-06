const Aria = require('./aria');
const { label } = require('./native-label');

module.exports = class AriaTextarea extends Aria {
  get implicit() {
    return 'textbox';
  }

  get allowedRoles() {
    return [];
  }

  get implicitAttributes() {
    return ['disabled', 'placeholder', 'required', 'readonly'];
  }

  get disallowNone() {
    return true;
  }

  get nativeLabel() {
    return label(this.node);
  }
};
