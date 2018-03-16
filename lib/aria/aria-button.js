import Aria from './aria';
import { label } from './native-label';

export default class AriaButton extends Aria {
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
}
