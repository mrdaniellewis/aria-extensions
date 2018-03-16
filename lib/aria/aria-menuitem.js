import Aria from './aria';

export default class AriaMenuitem extends Aria {
  get implicit() {
    switch (this.node.getAttribute('type')) {
      case 'checkbox':
        return 'menuitemcheckbox';
      case 'radio':
        return 'menuitemradio';
      case 'command':
      default:
        return 'menuitem';
    }
  }

  get allowedRoles() {
    return [];
  }
}
