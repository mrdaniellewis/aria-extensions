import Aria from './aria';

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
}
