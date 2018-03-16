import Aria from './aria';

export default class AriaA extends Aria {
  get implicit() {
    return this.node.href ? 'link' : null;
  }

  get allowedRoles() {
    return this.node.href
      ? ['button', 'checkbox', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'switch', 'tab', 'treeitem']
      : super.allowedRoles;
  }

  get disallowNone() {
    return !!this.node.href;
  }
}
