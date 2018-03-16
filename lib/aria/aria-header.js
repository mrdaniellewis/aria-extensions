import Aria from './aria';

export default class AriaFooter extends Aria {
  get implicit() {
    return this.node.closest('article,aside,main,nav,section')
      ? null
      : 'banner';
  }

  get allowedRoles() {
    return ['group', 'none', 'presentation'];
  }
}
